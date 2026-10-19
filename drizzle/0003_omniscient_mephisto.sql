CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`topic` text NOT NULL,
	`message` text NOT NULL,
	`email` text,
	`device` text,
	`app_version` text,
	`created_at` integer NOT NULL,
	`handled_at` integer
);
--> statement-breakpoint
CREATE INDEX `feedback_created_idx` ON `feedback` (`created_at`);