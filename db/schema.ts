import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  decimal,
  index,
  integer,
  pgMaterializedView,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 36 }).primaryKey().unique(),
    name: varchar('name').unique(),
    xHandle: varchar('xHandle').default(''),
    mainEvm: varchar('mainEvm', { length: 255 }).default(''),
    referrerCode: varchar('referrerCode').default(''),
    cookieConsent: integer('cookieConsent').default(sql`null`),
    faceSignUserId: varchar('faceSignUserId').unique(),
    faceSignToken: varchar('faceSignToken').default(sql`null`),
    faceSignTokenCreatedAt: timestamp('faceSignTokenCreatedAt'),
    popCredentialsId: varchar('popCredentialId').default(sql`null`),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('main_evm_idx').on(table.mainEvm),
    index('referrer_code_idx').on(table.referrerCode),
    index('name_idx').on(table.name),
    index('x_handle_idx').on(table.xHandle),
  ],
);

export const userQuests = pgTable(
  'user_quests',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar('userId', { length: 36 }).notNull(),
    questName: varchar('questName', { length: 255 }).notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('user_quests_user_id_idx').on(table.userId),
    index('user_quests_quest_name_idx').on(table.questName),
    index('user_quests_user_quest_idx').on(table.userId, table.questName),
  ],
);

export const userWallets = pgTable(
  'user_wallets',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar('userId', { length: 36 }).notNull(),
    address: varchar('address').notNull(),
    walletType: varchar('walletType').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('user_wallets_user_id_idx').on(table.userId),
    index('user_wallets_address_idx').on(table.address),
    index('user_wallets_wallet_type_idx').on(table.walletType),
    unique('user_wallets_user_address_unique').on(table.userId, table.address),
  ],
);

export const quests = pgTable(
  'quests',
  {
    id: integer('id').primaryKey(),
    name: varchar('name').notNull().unique(),
    pointsReward: integer('pointsReward').notNull(),
    isActive: boolean('isActive').notNull().default(false),
    isRepeatable: boolean('isRepeatable').notNull().default(false),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('quests_name_idx').on(table.name),
    index('quests_is_active_idx').on(table.isActive),
    index('quests_is_repeatable_idx').on(table.isRepeatable),
  ],
);

export const referrals = pgTable(
  'referrals',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar('userId', { length: 36 }).notNull(),
    referralCode: varchar('referralCode').notNull().unique(),
    referralCount: integer('referralCount').notNull().default(0),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('referrals_user_id_idx').on(table.userId),
    index('referrals_referral_code_idx').on(table.referralCode),
  ],
);

export const userTokens = pgTable(
  'user_tokens',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar('userId', { length: 36 }).default(''),
    publicAddress: varchar('publicAddress', { length: 255 }).notNull(),
    walletType: varchar('walletType').notNull(),
    accessToken: text('accessToken').notNull(),
    refreshToken: text('refreshToken').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('user_tokens_user_id_idx').on(table.userId),
    index('user_tokens_public_address_idx').on(table.publicAddress),
    index('user_tokens_wallet_type_idx').on(table.walletType),
    index('user_tokens_refresh_token_idx').on(table.refreshToken),
    unique('user_tokens_user_address_unique').on(
      table.userId,
      table.publicAddress,
    ),
  ],
);

export const oauthXSessions = pgTable(
  'oauth_x_sessions',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar('userId', { length: 36 }).notNull().unique(),
    codeVerifier: varchar('codeVerifier').default(sql`null`),
    state: varchar('state').default(sql`null`),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('oauth_x_sessions_user_id_idx').on(table.userId),
    unique('oauth_x_sessions_user_id_unique').on(table.userId),
  ],
);

export const wallchainLeaderboard = pgTable(
  'wallchain_leaderboard',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    username: varchar('username').notNull().unique(),
    relativeMindshare: decimal('relativeMindshare')
      .notNull()
      .default(sql`0.0`),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('wallchain_leaderboard_username_idx').on(table.username)],
);

export const lockTable = pgTable('lock_table', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
});

export const leaderboardView = pgMaterializedView('leaderboard_view', {
  id: serial('id'),
  userId: varchar('userId', { length: 36 }).primaryKey(),
  name: varchar('name'),
  xHandle: varchar('xHandle'),
  questPoints: integer('questPoints').notNull().default(0),
  socialPoints: integer('socialPoints').notNull().default(0),
  contributionPoints: integer('contributionPoints').notNull().default(0),
  referralCount: integer('referralCount').notNull().default(0),
  totalPoints: integer('totalPoints').notNull().default(0),
  rank: integer('rank').notNull().default(0),
  relativeMindshare: decimal('relativeMindshare').default('0.0'),
}).as(sql`
  WITH quest_aggregates AS (
    SELECT 
      uq."userId",
      uq."questName",
      COUNT(*) as completion_count,
      q."pointsReward",
      q."isRepeatable"
    FROM ${userQuests} uq
    LEFT JOIN ${quests} q ON uq."questName" = q."name"
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
    FROM ${quests}
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
    FROM ${users} u
    LEFT JOIN quest_points qp ON qp."userId" = u."id"
    LEFT JOIN ${referrals} r ON r."userId" = u."id"
    CROSS JOIN referral_quest_points rqp
  ),
  wallchain_matches AS (
    SELECT 
      u."id" as "userId",
      wl."relativeMindshare"
    FROM ${users} u
    JOIN ${wallchainLeaderboard} wl ON wl."username" = COALESCE(NULLIF(u."xHandle", ''), u."name")
  ),
  wallchain_unmatched AS (
    SELECT 
      wl."username" as "name",
      wl."relativeMindshare",
      NULL::varchar as "userId"
    FROM ${wallchainLeaderboard} wl
    WHERE NOT EXISTS (
      SELECT 1 FROM ${users} u 
      WHERE wl."username" = COALESCE(NULLIF(u."xHandle", ''), u."name")
    )
  ),
  total_quest_points AS (
    SELECT SUM(COALESCE(qpr.quest_points, 0)) as total_points
    FROM ${users} u
    LEFT JOIN quest_points_with_referrals qpr ON qpr."userId" = u."id"
  )
  SELECT 
    ROW_NUMBER() OVER (ORDER BY COALESCE(qpr.quest_points, 0) DESC, COALESCE(NULLIF(u."xHandle", ''), u."name") ASC) as "id",
    u."id" as "userId",
    CASE 
      WHEN u."xHandle" IS NOT NULL AND u."xHandle" != '' THEN '@' || u."xHandle"
      ELSE u."name"
    END as "name",
    u."xHandle",
    COALESCE(qpr.quest_points, 0) as "questPoints",
    COALESCE(tqp.total_points, 0) * COALESCE(wm."relativeMindshare"::numeric, 0) as "socialPoints",
    0 as "contributionPoints",
    COALESCE(qpr."referralCount", 0) as "referralCount",
     COALESCE(qpr.quest_points, 0) + COALESCE(tqp.total_points, 0) * COALESCE(wm."relativeMindshare"::numeric, 0) + 0 as "totalPoints",
     DENSE_RANK() OVER (ORDER BY COALESCE(qpr.quest_points, 0) + COALESCE(tqp.total_points, 0) * COALESCE(wm."relativeMindshare"::numeric, 0) DESC) as "rank",
    COALESCE(wm."relativeMindshare", '0.0') as "relativeMindshare"
  FROM ${users} u
  LEFT JOIN quest_points_with_referrals qpr ON qpr."userId" = u."id"
  LEFT JOIN wallchain_matches wm ON wm."userId" = u."id"
  CROSS JOIN total_quest_points tqp
  WHERE COALESCE(qpr.quest_points, 0) + COALESCE(tqp.total_points, 0) * COALESCE(wm."relativeMindshare"::numeric, 0) >= 1
  
  UNION ALL
  
  SELECT 
    (SELECT COUNT(*) FROM ${users}) + ROW_NUMBER() OVER (ORDER BY wu."relativeMindshare" DESC) as "id",
    wu."userId",
    '@' || wu."name" as "name",
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
`);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userQuests: many(userQuests),
  userWallets: many(userWallets),
  userTokens: many(userTokens),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  user: one(users, {
    fields: [referrals.userId],
    references: [users.id],
  }),
}));

export const userQuestsRelations = relations(userQuests, ({ one }) => ({
  user: one(users, {
    fields: [userQuests.userId],
    references: [users.id],
  }),
  quest: one(quests, {
    fields: [userQuests.questName],
    references: [quests.name],
  }),
}));

export const userWalletsRelations = relations(userWallets, ({ one }) => ({
  user: one(users, {
    fields: [userWallets.userId],
    references: [users.id],
  }),
}));

export const questsRelations = relations(quests, ({ many }) => ({
  userQuests: many(userQuests),
}));

export const userTokensRelations = relations(userTokens, ({ one }) => ({
  user: one(users, {
    fields: [userTokens.userId],
    references: [users.id],
  }),
}));
