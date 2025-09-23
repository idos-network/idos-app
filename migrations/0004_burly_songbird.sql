CREATE TABLE "quests" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"pointsReward" integer NOT NULL,
	"isActive" boolean DEFAULT false NOT NULL,
	"isRepeatable" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "quests_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "referrals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(36) NOT NULL,
	"referralCode" varchar NOT NULL,
	"referralCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "referrals_referralCode_unique" UNIQUE("referralCode")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "xHandle" varchar DEFAULT '';--> statement-breakpoint
CREATE INDEX "quests_name_idx" ON "quests" USING btree ("name");--> statement-breakpoint
CREATE INDEX "quests_is_active_idx" ON "quests" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX "quests_is_repeatable_idx" ON "quests" USING btree ("isRepeatable");--> statement-breakpoint
CREATE INDEX "referrals_user_id_idx" ON "referrals" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "referrals_referral_code_idx" ON "referrals" USING btree ("referralCode");--> statement-breakpoint
CREATE INDEX "name_idx" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "x_handle_idx" ON "users" USING btree ("xHandle");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_name_unique" UNIQUE("name");--> statement-breakpoint
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
  )
  SELECT 
    u."id" as "userId",
    u."name",
    u."xHandle",
    COALESCE(qpr.quest_points, 0) as "questPoints",
    0 as "socialPoints",
    0 as "contributionPoints",
    COALESCE(qpr."referralCount", 0) as "referralCount",
    COALESCE(qpr.quest_points, 0) as "totalPoints"
  FROM "users" u
  LEFT JOIN quest_points_with_referrals qpr ON qpr."userId" = u."id"
  ORDER BY "totalPoints" DESC, u."name" ASC
);