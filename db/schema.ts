import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 36 }).primaryKey().unique(),
    mainEvm: varchar('mainEvm', { length: 255 }).default(''),
    referrerCode: varchar('referrerCode').default(''),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('main_evm_idx').on(table.mainEvm),
    index('referrer_code_idx').on(table.referrerCode),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userQuests: many(userQuests),
  userWallets: many(userWallets),
  userTokens: many(userTokens),
}));

export const userQuestsRelations = relations(userQuests, ({ one }) => ({
  user: one(users, {
    fields: [userQuests.userId],
    references: [users.id],
  }),
}));

export const userWalletsRelations = relations(userWallets, ({ one }) => ({
  user: one(users, {
    fields: [userWallets.userId],
    references: [users.id],
  }),
}));

export const userTokensRelations = relations(userTokens, ({ one }) => ({
  user: one(users, {
    fields: [userTokens.userId],
    references: [users.id],
  }),
}));
