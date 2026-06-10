import { doublePrecision, 
    integer, 
    varchar, 
    text, 
    bigint, 
    jsonb, 
    boolean, 
    serial, 
    pgTable, 
    timestamp
} from "drizzle-orm/pg-core";

export const survey = pgTable("survey", {
    id: varchar().primaryKey().notNull(),
    title: varchar().notNull(),
    description: text().notNull(),
    target_number: integer().notNull(),
    reward_amount: doublePrecision().notNull(),
    questions: jsonb().notNull(),
    owner: varchar().notNull(),
    image: text().notNull(),
    finish: boolean().default(false),
    view: bigint({ mode: "number"}).default(0),
    created_at: timestamp().defaultNow(),
});

export const Answer = pgTable("answer", {
    id: serial().primaryKey(),
    answers: jsonb().default({}),
    survey_id: varchar().references(() => survey.id),
    created_at: timestamp().defaultNow(),
})