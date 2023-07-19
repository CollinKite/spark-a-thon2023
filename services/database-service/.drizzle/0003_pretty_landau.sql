DO $$ BEGIN
 CREATE TYPE "messageBy" AS ENUM('user', 'ai-model');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "messageBy" "messageBy" DEFAULT 'user' NOT NULL;