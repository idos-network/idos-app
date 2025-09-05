-- Add cookie consent field to users table
ALTER TABLE users 
ADD COLUMN "cookieConsent" boolean;
