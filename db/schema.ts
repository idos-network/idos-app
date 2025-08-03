import {
  pgTable,
  varchar,
  timestamp,
  integer,
  boolean,
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

export const quests = pgTable(
  'quests',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    pointsReward: integer('pointsReward').notNull(),
    isActive: boolean().default(true),
    isRepeatable: boolean('isRepeatable').default(false),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('is_active_idx').on(table.isActive),
    index('is_repeatable_idx').on(table.isRepeatable),
  ],
);

export const userQuests = pgTable(
  'user_quests',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar('userId', { length: 36 }).notNull(),
    questId: integer('questId').notNull(),
    completionCount: integer('completionCount').default(0),
    lastCompletedAt: timestamp('lastCompletedAt'),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('user_quest_unique_idx').on(table.userId, table.questId),
    index('user_quests_user_id_idx').on(table.userId),
    index('user_quests_quest_id_idx').on(table.questId),
    index('user_quests_completion_count_idx').on(table.completionCount),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userQuests: many(userQuests),
}));

export const questsRelations = relations(quests, ({ many }) => ({
  userQuests: many(userQuests),
}));

export const userQuestsRelations = relations(userQuests, ({ one }) => ({
  user: one(users, {
    fields: [userQuests.userId],
    references: [users.id],
  }),
  quest: one(quests, {
    fields: [userQuests.questId],
    references: [quests.id],
  }),
}));
