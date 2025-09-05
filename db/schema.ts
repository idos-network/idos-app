import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
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
    faceSignToken: varchar('faceSignToken'),
    faceSignTokenCreatedAt: timestamp('faceSignTokenCreatedAt'),
    faceSignDone: boolean('faceSignDone').default(false),
    faceSignHash: varchar('faceSignHash', { length: 300 }),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userQuests: many(userQuests),
  userWallets: many(userWallets),
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
