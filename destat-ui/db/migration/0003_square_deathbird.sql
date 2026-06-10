ALTER TABLE "survey" ADD COLUMN "reward_amount" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "survey" DROP COLUMN "reward_number";