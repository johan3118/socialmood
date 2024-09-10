DROP INDEX IF EXISTS `planes_nombre_unique`;--> statement-breakpoint
DROP INDEX IF EXISTS `planes_paypal_plan_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `planes_nombre_paypal_plan_id_unique` ON `planes` (`nombre`,`paypal_plan_id`);