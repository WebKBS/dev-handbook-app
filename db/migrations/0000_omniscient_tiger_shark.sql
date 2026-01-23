CREATE TABLE `bookmark` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`domain` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookmark_slug_unique` ON `bookmark` (`slug`);--> statement-breakpoint
CREATE TABLE `read_state` (
	`doc_key` text PRIMARY KEY NOT NULL,
	`domain` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`last_read_at` integer,
	`completed_at` integer,
	`updated_at` integer NOT NULL
);
