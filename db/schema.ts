import {
  pgTable,
  varchar,
  timestamp,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 36 }).primaryKey().unique(),
    mainEvm: varchar('mainEvm', { length: 255 }).default(''),
    referralCode: varchar('referralCode').default(''),
    referralCount: integer().default(0),
    referrerCode: varchar('referrerCode').default(''),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('referral_code_idx').on(table.referralCode),
    index('main_evm_idx').on(table.mainEvm),
  ],
);

export const userQuests = pgTable(
  'user_quests',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar('userId', { length: 36 }).notNull(),
    questName: varchar('questName', { length: 255 }).notNull(),
    completionCount: integer('completionCount').default(0),
    lastCompletedAt: timestamp('lastCompletedAt'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('user_quest_unique_idx').on(table.userId, table.questName),
    index('user_quests_user_id_idx').on(table.userId),
    index('user_quests_quest_name_idx').on(table.questName),
    index('user_quests_completion_count_idx').on(table.completionCount),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userQuests: many(userQuests),
}));

export const userQuestsRelations = relations(userQuests, ({ one }) => ({
  user: one(users, {
    fields: [userQuests.userId],
    references: [users.id],
  }),
}));
