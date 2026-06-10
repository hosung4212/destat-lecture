CREATE TABLE "daily_live_survey" (
	"id" serial PRIMARY KEY NOT NULL,
	"count" bigint DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_visitor" (
	"id" serial PRIMARY KEY NOT NULL,
	"count" bigint DEFAULT 0,
	"day_start" timestamp NOT NULL,
	CONSTRAINT "daily_visitor_day_start_unique" UNIQUE("day_start")
);
