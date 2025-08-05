import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const users = sqliteTable(
  'users',
  {
    id: text('id', { length: 36 }).primaryKey().unique(),
    mainEvm: text('mainEvm', { length: 255 }).default(''),
    referrerCode: text('referrerCode').default(''),
    createdAt: text('createdAt')
      .notNull()
      .default(sql`(current_timestamp)`),
    updatedAt: text('updatedAt')
      .notNull()
      .default(sql`(current_timestamp)`)
      .$onUpdate(() => sql`(current_timestamp)`),
  },
  (table) => [
    index('main_evm_idx').on(table.mainEvm),
    index('referrer_code_idx').on(table.referrerCode),
  ],
);

export const userQuests = sqliteTable(
  'user_quests',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    userId: text('userId', { length: 36 }).notNull(),
    questName: text('questName', { length: 255 }).notNull(),
    completedAt: text('completedAt')
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (table) => [
    index('user_quests_user_id_idx').on(table.userId),
    index('user_quests_quest_name_idx').on(table.questName),
    index('user_quests_user_quest_idx').on(table.userId, table.questName),
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
