-- Custom SQL migration file, put your code below! --
ALTER TABLE "users" ALTER COLUMN "cookieConsent" SET DATA TYPE integer USING (CASE WHEN "cookieConsent" IS TRUE THEN 1 WHEN "cookieConsent" IS FALSE THEN 0 ELSE NULL END);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "cookieConsent" SET DEFAULT null;