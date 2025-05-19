CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`account_pubkey` text NOT NULL,
	`author_pubkey` text NOT NULL,
	`scheduled_at` text,
	`relays` text,
	`status` text NOT NULL,
	`publish_attempted_at` text,
	`publish_error` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`raw_event` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `posts_account_pubkey_idx` ON `posts` (`account_pubkey`);--> statement-breakpoint
CREATE INDEX `posts_author_pubkey_idx` ON `posts` (`author_pubkey`);--> statement-breakpoint
CREATE INDEX `posts_scheduled_at_idx` ON `posts` (`scheduled_at`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);