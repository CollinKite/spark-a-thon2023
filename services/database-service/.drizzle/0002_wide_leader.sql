CREATE TABLE IF NOT EXISTS "rooms" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersToRooms" (
	"userId" text NOT NULL,
	"roomId" text NOT NULL,
	CONSTRAINT usersToRooms_userId_roomId PRIMARY KEY("userId","roomId")
);
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN IF EXISTS "messages";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
