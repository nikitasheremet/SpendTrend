CREATE TABLE "expense_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"accountId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_subcategories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"accountId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"categoryId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
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
	"categoryId" uuid NOT NULL,
	"subCategoryId" uuid NOT NULL,
	"netAmount" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "income" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"accountId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"amount" numeric NOT NULL,
	"date" date NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expense_subcategories" ADD CONSTRAINT "expense_subcategories_categoryId_expense_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."expense_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_categoryId_expense_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."expense_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_subCategoryId_expense_subcategories_id_fk" FOREIGN KEY ("subCategoryId") REFERENCES "public"."expense_subcategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "accountId_name" ON "expense_categories" USING btree ("accountId","name");--> statement-breakpoint
CREATE UNIQUE INDEX "categoryId_name" ON "expense_subcategories" USING btree ("categoryId","name");