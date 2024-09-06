CREATE TABLE `oauth_account` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_usuario` integer NOT NULL,
	`id_proveedor_autenticacion` integer NOT NULL,
	`codigo_usuario_proveedor` text NOT NULL,
	`token_acceso` text NOT NULL,
	`token_refresh` text NOT NULL,
	`expira` integer NOT NULL,
	FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_proveedor_autenticacion`) REFERENCES `proveedores_autenticacion`(`id`) ON UPDATE no action ON DELETE no action
);
