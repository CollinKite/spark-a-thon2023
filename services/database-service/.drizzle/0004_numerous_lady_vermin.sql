ALTER TABLE "messages" ADD COLUMN "roomId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_roomId_rooms_id_fk" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
