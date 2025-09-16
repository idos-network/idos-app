CREATE TABLE "user_quests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_quests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(36) NOT NULL,
	"questName" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_wallets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_wallets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(36) NOT NULL,
	"address" varchar NOT NULL,
	"walletType" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "user_wallets_user_address_unique" UNIQUE("userId","address")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"mainEvm" varchar(255) DEFAULT '',
	"referrerCode" varchar DEFAULT '',
	"cookieConsent" boolean DEFAULT null,
	"faceSignToken" varchar,
	"faceSignTokenCreatedAt" timestamp,
	"faceSignDone" boolean DEFAULT false,
	"faceSignHash" varchar(300),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE INDEX "user_quests_user_id_idx" ON "user_quests" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_quests_quest_name_idx" ON "user_quests" USING btree ("questName");--> statement-breakpoint
CREATE INDEX "user_quests_user_quest_idx" ON "user_quests" USING btree ("userId","questName");--> statement-breakpoint
CREATE INDEX "user_wallets_user_id_idx" ON "user_wallets" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_wallets_address_idx" ON "user_wallets" USING btree ("address");--> statement-breakpoint
CREATE INDEX "user_wallets_wallet_type_idx" ON "user_wallets" USING btree ("walletType");--> statement-breakpoint
CREATE INDEX "main_evm_idx" ON "users" USING btree ("mainEvm");--> statement-breakpoint
CREATE INDEX "referrer_code_idx" ON "users" USING btree ("referrerCode");