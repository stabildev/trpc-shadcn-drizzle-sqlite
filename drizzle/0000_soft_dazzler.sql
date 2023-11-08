CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`content` text,
	`done` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
