CREATE TABLE `bookmark` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`domain` text NOT NULL,
	`description` text
);
--> statement-breakpoint
DROP TABLE `favorite`;