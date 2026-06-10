ALTER TABLE "daily_live_survey" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "answer" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "survey" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "daily_live_survey" DROP COLUMN "create_at";--> statement-breakpoint
ALTER TABLE "answer" DROP COLUMN "create_at";--> statement-breakpoint
ALTER TABLE "survey" DROP COLUMN "create_at";