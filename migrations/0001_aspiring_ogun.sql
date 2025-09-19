ALTER TABLE "users" ADD COLUMN "name" varchar(255) DEFAULT '';--> statement-breakpoint
CREATE INDEX "name_idx" ON "users" USING btree ("name");