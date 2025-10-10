CREATE TABLE "oauth_x_sessions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "oauth_x_sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(36) NOT NULL,
	"codeVerifier" varchar DEFAULT null,
	"state" varchar DEFAULT null,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "oauth_x_sessions_userId_unique" UNIQUE("userId"),
	CONSTRAINT "oauth_x_sessions_user_id_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE INDEX "oauth_x_sessions_user_id_idx" ON "oauth_x_sessions" USING btree ("userId");