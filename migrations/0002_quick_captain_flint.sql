CREATE TABLE "user_tokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_tokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(36) DEFAULT '',
	"publicAddress" varchar(255) NOT NULL,
	"walletType" varchar NOT NULL,
	"accessToken" text NOT NULL,
	"refreshToken" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "user_tokens_user_address_unique" UNIQUE("userId","publicAddress")
);
--> statement-breakpoint
CREATE INDEX "user_tokens_user_id_idx" ON "user_tokens" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_tokens_public_address_idx" ON "user_tokens" USING btree ("publicAddress");--> statement-breakpoint
CREATE INDEX "user_tokens_wallet_type_idx" ON "user_tokens" USING btree ("walletType");--> statement-breakpoint
CREATE INDEX "user_tokens_refresh_token_idx" ON "user_tokens" USING btree ("refreshToken");