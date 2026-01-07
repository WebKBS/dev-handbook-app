CREATE TABLE `read_state` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`doc_key` text PRIMARY KEY NOT NULL,
	`domain` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`last_read_at` integer,
	`completed_at` integer,
	`updated_at` integer NOT NULL
);
