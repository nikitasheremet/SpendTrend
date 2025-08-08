CREATE TABLE "expense_categories" (
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"subcategories" varchar(255)[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"accountId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"amount" integer NOT NULL,
	"date" date NOT NULL,
	"paidBackAmount" integer NOT NULL,
	"category" varchar(255) NOT NULL,
	"subCategory" varchar(255) NOT NULL,
	"netAmount" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "userId_name" ON "expense_categories" USING btree ("userId","name");