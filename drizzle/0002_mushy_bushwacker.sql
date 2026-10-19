CREATE TABLE `ip_bans` (
	`ip` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);
