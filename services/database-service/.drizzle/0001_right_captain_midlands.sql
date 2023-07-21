ALTER TABLE "messages" ADD COLUMN "id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "messages" json DEFAULT '[]'::json;