CREATE TABLE "user_quests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_quests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(36) NOT NULL,
	"questName" varchar(255) NOT NULL,
	"completionCount" integer DEFAULT 0,
	"lastCompletedAt" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"mainEvm" varchar(255) DEFAULT '',
	"referralCode" varchar DEFAULT '',
	"referralCount" integer DEFAULT 0,
	"referrerCode" varchar DEFAULT '',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_quest_unique_idx" ON "user_quests" USING btree ("userId","questName");--> statement-breakpoint
CREATE INDEX "user_quests_user_id_idx" ON "user_quests" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_quests_quest_name_idx" ON "user_quests" USING btree ("questName");--> statement-breakpoint
CREATE INDEX "user_quests_completion_count_idx" ON "user_quests" USING btree ("completionCount");--> statement-breakpoint
CREATE UNIQUE INDEX "referral_code_idx" ON "users" USING btree ("referralCode");--> statement-breakpoint
CREATE INDEX "main_evm_idx" ON "users" USING btree ("mainEvm");