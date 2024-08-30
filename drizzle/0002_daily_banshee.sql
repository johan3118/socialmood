CREATE TABLE `categorias` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text
);
--> statement-breakpoint
CREATE TABLE `colores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`codigo_hex` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cuentas_redes_sociales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`llave_acceso` text NOT NULL,
	`usuario_cuenta` text NOT NULL,
	`codigo_cuenta` text NOT NULL,
	`fecha_vencimiento_acceso` integer NOT NULL,
	`id_subscripcion` integer NOT NULL,
	`id_red_social` integer NOT NULL,
	`id_color` integer NOT NULL,
	FOREIGN KEY (`id_subscripcion`) REFERENCES `subscripciones`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_red_social`) REFERENCES `redes_sociales`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_color`) REFERENCES `colores`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `estados_factura` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text
);
--> statement-breakpoint
CREATE TABLE `estados_invitacion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text
);
--> statement-breakpoint
CREATE TABLE `estados_plan` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text
);
--> statement-breakpoint
CREATE TABLE `estados_red_social` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text
);
--> statement-breakpoint
CREATE TABLE `estados_subscripcion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text
);
--> statement-breakpoint
CREATE TABLE `facturas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codigo_transaccion` text NOT NULL,
	`referencia_pago` text,
	`monto_total` integer NOT NULL,
	`fecha_facturacion` integer NOT NULL,
	`notas` text,
	`nombre_plan` text NOT NULL,
	`id_metodo_pago` integer NOT NULL,
	`id_estado_factura` integer NOT NULL,
	`id_usuario` integer NOT NULL,
	`id_plan_subscripcion` integer NOT NULL,
	`id_subscripcion` integer NOT NULL,
	FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodos_pago`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_estado_factura`) REFERENCES `estados_factura`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_plan_subscripcion`) REFERENCES `planes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_subscripcion`) REFERENCES `subscripciones`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `invitaciones_subscripcion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre_invitado` text NOT NULL,
	`apellido_invitado` text NOT NULL,
	`correo_electronico_invitado` text NOT NULL,
	`codigo` text NOT NULL,
	`fecha_emision` integer NOT NULL,
	`fecha_vencimiento` integer NOT NULL,
	`id_subscripcion` integer NOT NULL,
	`id_estado_invitaciones` integer NOT NULL,
	FOREIGN KEY (`id_subscripcion`) REFERENCES `subscripciones`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_estado_invitaciones`) REFERENCES `estados_invitacion`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `metodos_pago` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text NOT NULL,
	`enlace_plataforma` text
);
--> statement-breakpoint
CREATE TABLE `planes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`costo` integer NOT NULL,
	`cantidad_interacciones_mes` integer NOT NULL,
	`cantidad_usuarios_permitidos` integer NOT NULL,
	`cantidad_cuentas_permitidas` integer NOT NULL,
	`descripcion` text,
	`id_estado_plan` integer NOT NULL,
	`id_tipo_facturacion` integer NOT NULL,
	FOREIGN KEY (`id_estado_plan`) REFERENCES `estados_plan`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_tipo_facturacion`) REFERENCES `tipos_facturacion`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `proveedores_autenticacion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`enlace` text NOT NULL,
	`activo` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `redes_sociales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`enlace_logo` text,
	`enlace_plataforma` text,
	`id_estado_red_social` integer NOT NULL,
	FOREIGN KEY (`id_estado_red_social`) REFERENCES `estados_red_social`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reglas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alias` text,
	`prompt` text NOT NULL,
	`id_regla_padre` integer,
	`id_tipo_regla` integer NOT NULL,
	`id_cuenta` integer NOT NULL,
	FOREIGN KEY (`id_tipo_regla`) REFERENCES `tipos_regla`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_cuenta`) REFERENCES `cuentas_redes_sociales`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_regla_padre`) REFERENCES `reglas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subcategorias_reglas` (
	`id_subcategoria` integer NOT NULL,
	`id_regla` integer NOT NULL,
	PRIMARY KEY(`id_regla`, `id_subcategoria`),
	FOREIGN KEY (`id_subcategoria`) REFERENCES `subcategorias`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_regla`) REFERENCES `reglas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subcategorias` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text,
	`id_categoria` integer NOT NULL,
	FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscripciones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`referencia_pago` text,
	`fecha_adquisicion` integer NOT NULL,
	`costo` integer NOT NULL,
	`nombre_plan` text NOT NULL,
	`fecha_proximo_pago` integer,
	`fecha_ultimo_pago` integer,
	`tipo_facturacion` text NOT NULL,
	`id_propietario` integer NOT NULL,
	`id_metodo_pago` integer NOT NULL,
	`id_estado_subscripcion` integer NOT NULL,
	`id_plan_subscripcion` integer NOT NULL,
	FOREIGN KEY (`id_propietario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodos_pago`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_estado_subscripcion`) REFERENCES `estados_subscripcion`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_plan_subscripcion`) REFERENCES `planes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tipos_facturacion` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text
);
--> statement-breakpoint
CREATE TABLE `tipos_regla` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text
);
--> statement-breakpoint
CREATE TABLE `tipos_usuario` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`descripcion` text
);
--> statement-breakpoint
CREATE TABLE `usuarios_subscripciones` (
	`id_usuario` integer NOT NULL,
	`id_subscripcion` integer NOT NULL,
	PRIMARY KEY(`id_subscripcion`, `id_usuario`),
	FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_subscripcion`) REFERENCES `subscripciones`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`apellido` text NOT NULL,
	`direccion` text,
	`correo_electronico` text NOT NULL,
	`llave_acceso` text NOT NULL,
	`id_proveedor_autenticacion` integer NOT NULL,
	`id_tipo_usuario` integer NOT NULL,
	FOREIGN KEY (`id_proveedor_autenticacion`) REFERENCES `proveedores_autenticacion`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipos_usuario`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
CREATE UNIQUE INDEX `categorias_nombre_unique` ON `categorias` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `colores_nombre_unique` ON `colores` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `colores_codigo_hex_unique` ON `colores` (`codigo_hex`);--> statement-breakpoint
CREATE UNIQUE INDEX `cuentas_redes_sociales_codigo_cuenta_unique` ON `cuentas_redes_sociales` (`codigo_cuenta`);--> statement-breakpoint
CREATE UNIQUE INDEX `estados_factura_nombre_unique` ON `estados_factura` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `estados_invitacion_nombre_unique` ON `estados_invitacion` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `estados_plan_nombre_unique` ON `estados_plan` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `estados_red_social_nombre_unique` ON `estados_red_social` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `estados_subscripcion_nombre_unique` ON `estados_subscripcion` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `facturas_codigo_transaccion_unique` ON `facturas` (`codigo_transaccion`);--> statement-breakpoint
CREATE UNIQUE INDEX `invitaciones_subscripcion_codigo_unique` ON `invitaciones_subscripcion` (`codigo`);--> statement-breakpoint
CREATE UNIQUE INDEX `metodos_pago_nombre_unique` ON `metodos_pago` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `metodos_pago_enlace_plataforma_unique` ON `metodos_pago` (`enlace_plataforma`);--> statement-breakpoint
CREATE UNIQUE INDEX `planes_nombre_unique` ON `planes` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `proveedores_autenticacion_nombre_unique` ON `proveedores_autenticacion` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `proveedores_autenticacion_enlace_unique` ON `proveedores_autenticacion` (`enlace`);--> statement-breakpoint
CREATE UNIQUE INDEX `redes_sociales_nombre_unique` ON `redes_sociales` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `redes_sociales_enlace_plataforma_unique` ON `redes_sociales` (`enlace_plataforma`);--> statement-breakpoint
CREATE UNIQUE INDEX `reglas_alias_unique` ON `reglas` (`alias`);--> statement-breakpoint
CREATE UNIQUE INDEX `subcategorias_nombre_unique` ON `subcategorias` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `tipos_facturacion_nombre_unique` ON `tipos_facturacion` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `tipos_regla_nombre_unique` ON `tipos_regla` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `tipos_usuario_nombre_unique` ON `tipos_usuario` (`nombre`);--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_correo_electronico_unique` ON `usuarios` (`correo_electronico`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/