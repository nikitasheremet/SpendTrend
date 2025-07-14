CREATE TABLE "expense_categories" (
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"subcategories" varchar(255)[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "expenses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"date" varchar(255) NOT NULL,
	"paidBackAmount" integer NOT NULL,
	"category" varchar(255) NOT NULL,
	"subCategory" varchar(255) NOT NULL,
	"netAmount" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX "userId_name" ON "expense_categories" USING btree ("userId","name");