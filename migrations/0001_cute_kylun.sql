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
CREATE INDEX "user_wallets_user_id_idx" ON "user_wallets" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_wallets_address_idx" ON "user_wallets" USING btree ("address");--> statement-breakpoint
CREATE INDEX "user_wallets_wallet_type_idx" ON "user_wallets" USING btree ("walletType");