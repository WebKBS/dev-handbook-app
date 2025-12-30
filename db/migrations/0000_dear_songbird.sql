CREATE TABLE `bookmark` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`domain` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookmark_slug_unique` ON `bookmark` (`slug`);