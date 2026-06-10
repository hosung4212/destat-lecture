CREATE TABLE "daily_live_survey" (
	"id" serial PRIMARY KEY NOT NULL,
	"count" bigint DEFAULT 0,
	"create_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "answer" ADD COLUMN "create_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "survey" ADD COLUMN "create_at" timestamp DEFAULT now();