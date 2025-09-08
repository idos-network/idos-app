ALTER TABLE "users" ADD COLUMN "faceSignToken" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "faceSignTokenCreatedAt" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "faceSignDone" boolean DEFAULT false;