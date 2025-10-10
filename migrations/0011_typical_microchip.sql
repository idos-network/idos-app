CREATE TABLE "wallchain_leaderboard" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wallchain_leaderboard_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar NOT NULL,
	"relativeMindshare" numeric DEFAULT 0.0 NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "wallchain_leaderboard_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DROP MATERIALIZED VIEW "public"."leaderboard_view";--> statement-breakpoint
CREATE INDEX "wallchain_leaderboard_username_idx" ON "wallchain_leaderboard" USING btree ("username");--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."leaderboard_view" AS (
  WITH quest_aggregates AS (
    SELECT 
      uq."userId",
      uq."questName",
      COUNT(*) as completion_count,
      q."pointsReward",
      q."isRepeatable"
    FROM "user_quests" uq
    LEFT JOIN "quests" q ON uq."questName" = q."name"
    WHERE q."isActive" = true
    GROUP BY uq."userId", uq."questName", q."pointsReward", q."isRepeatable"
  ),
  quest_points AS (
    SELECT 
      qa."userId",
      COALESCE(SUM(
        CASE 
          WHEN qa."isRepeatable" = true THEN qa.completion_count * qa."pointsReward"
          ELSE LEAST(1, qa.completion_count) * qa."pointsReward"
        END
      ), 0) as quest_points
    FROM quest_aggregates qa
    GROUP BY qa."userId"
  ),
  referral_quest_points AS (
    SELECT "pointsReward"
    FROM "quests"
    WHERE "name" = 'referral_program'
    LIMIT 1
  ),
  quest_points_with_referrals AS (
    SELECT 
      u."id" as "userId",
      (
        COALESCE(qp.quest_points, 0) + COALESCE(r."referralCount", 0) * COALESCE(rqp."pointsReward", 0)
      ) * 
      CASE 
        WHEN COALESCE(r."referralCount", 0) >= 1000 THEN 3
        WHEN COALESCE(r."referralCount", 0) >= 100 THEN 2.75
        WHEN COALESCE(r."referralCount", 0) >= 25 THEN 2.5
        WHEN COALESCE(r."referralCount", 0) >= 5 THEN 2
        ELSE 1
      END as quest_points,
      COALESCE(r."referralCount", 0) as "referralCount"
    FROM "users" u
    LEFT JOIN quest_points qp ON qp."userId" = u."id"
    LEFT JOIN "referrals" r ON r."userId" = u."id"
    CROSS JOIN referral_quest_points rqp
  ),
  wallchain_matches AS (
    SELECT 
      u."id" as "userId",
      wl."relativeMindshare"
    FROM "users" u
    JOIN "wallchain_leaderboard" wl ON wl."username" = COALESCE(NULLIF(u."xHandle", ''), u."name")
  ),
  wallchain_unmatched AS (
    SELECT 
      wl."username" as "name",
      wl."relativeMindshare",
      NULL::varchar as "userId"
    FROM "wallchain_leaderboard" wl
    WHERE NOT EXISTS (
      SELECT 1 FROM "users" u 
      WHERE wl."username" = COALESCE(NULLIF(u."xHandle", ''), u."name")
    )
  ),
  total_quest_points AS (
    SELECT SUM(COALESCE(qpr.quest_points, 0)) as total_points
    FROM "users" u
    LEFT JOIN quest_points_with_referrals qpr ON qpr."userId" = u."id"
  )
  SELECT 
    ROW_NUMBER() OVER (ORDER BY COALESCE(qpr.quest_points, 0) DESC, COALESCE(NULLIF(u."xHandle", ''), u."name") ASC) as "id",
    u."id" as "userId",
    COALESCE(NULLIF(u."xHandle", ''), u."name") as "name",
    u."xHandle",
    COALESCE(qpr.quest_points, 0) as "questPoints",
    COALESCE(tqp.total_points, 0) * COALESCE(wm."relativeMindshare"::numeric, 0) as "socialPoints",
    0 as "contributionPoints",
    COALESCE(qpr."referralCount", 0) as "referralCount",
     COALESCE(qpr.quest_points, 0) + COALESCE(tqp.total_points, 0) * COALESCE(wm."relativeMindshare"::numeric, 0) + 0 as "totalPoints",
     DENSE_RANK() OVER (ORDER BY COALESCE(qpr.quest_points, 0) + COALESCE(tqp.total_points, 0) * COALESCE(wm."relativeMindshare"::numeric, 0) DESC) as "rank",
    COALESCE(wm."relativeMindshare", '0.0') as "relativeMindshare"
  FROM "users" u
  LEFT JOIN quest_points_with_referrals qpr ON qpr."userId" = u."id"
  LEFT JOIN wallchain_matches wm ON wm."userId" = u."id"
  CROSS JOIN total_quest_points tqp
  WHERE COALESCE(qpr.quest_points, 0) + COALESCE(tqp.total_points, 0) * COALESCE(wm."relativeMindshare"::numeric, 0) >= 1
  
  UNION ALL
  
  SELECT 
    (SELECT COUNT(*) FROM "users") + ROW_NUMBER() OVER (ORDER BY wu."relativeMindshare" DESC) as "id",
    wu."userId",
    wu."name",
    NULL::varchar as "xHandle",
    0 as "questPoints",
    COALESCE(tqp.total_points, 0) * COALESCE(wu."relativeMindshare"::numeric, 0) as "socialPoints",
    0 as "contributionPoints",
    0 as "referralCount",
    0 + COALESCE(tqp.total_points, 0) * COALESCE(wu."relativeMindshare"::numeric, 0) + 0 as "totalPoints",
    0 as "rank",
    wu."relativeMindshare"
  FROM wallchain_unmatched wu
  CROSS JOIN total_quest_points tqp
  WHERE COALESCE(tqp.total_points, 0) * COALESCE(wu."relativeMindshare"::numeric, 0) >= 1
  
  ORDER BY "totalPoints" DESC, "rank" ASC, "name" ASC
);