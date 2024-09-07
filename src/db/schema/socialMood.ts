import { integer, sqliteTable, text, primaryKey, foreignKey } from "drizzle-orm/sqlite-core";

export const sessionTable = sqliteTable("sesiones", {
  id: text("id").notNull().primaryKey(),
  userId: integer("usuario_id")
    .notNull()
    .references(() => usuariosTable.id),
  expiresAt: integer("expira").notNull(),
});

// Tabla Categorias
export const categoriasTable = sqliteTable("categorias", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
});

// Tabla Colores
export const coloresTable = sqliteTable("colores", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
  codigo_hex: text("codigo_hex").notNull().unique(),
});

// Tabla Cuentas_Redes_Sociales
export const cuentasRedesSocialesTable = sqliteTable("cuentas_redes_sociales", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  llave_acceso: text("llave_acceso").notNull(),
  usuario_cuenta: text("usuario_cuenta").notNull(),
  codigo_cuenta: text("codigo_cuenta").notNull().unique(),
  fecha_vencimiento_acceso: integer("fecha_vencimiento_acceso").notNull(),
  id_subscripcion: integer("id_subscripcion").notNull().references(() => subscripcionesTable.id),
  id_red_social: integer("id_red_social").notNull().references(() => redesSocialesTable.id),
  id_color: integer("id_color").notNull().references(() => coloresTable.id),
});

// Tabla Estados_Factura
export const estadosFacturaTable = sqliteTable("estados_factura", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
});

// Tabla Estados_Invitacion
export const estadosInvitacionTable = sqliteTable("estados_invitacion", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
});

// Tabla Estados_Plan
export const estadosPlanTable = sqliteTable("estados_plan", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
});

// Tabla Estados_Red_Social
export const estadosRedSocialTable = sqliteTable("estados_red_social", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
});

// Tabla Estados_Subscripcion
export const estadosSubscripcionTable = sqliteTable("estados_subscripcion", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
});

// Tabla Facturas
export const facturasTable = sqliteTable("facturas", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  codigo_transaccion: text("codigo_transaccion").notNull().unique(),
  referencia_pago: text("referencia_pago"),
  monto_total: integer("monto_total").notNull(),
  fecha_facturacion: integer("fecha_facturacion").notNull(),
  notas: text("notas"),
  nombre_plan: text("nombre_plan").notNull(),
  id_metodo_pago: integer("id_metodo_pago").notNull().references(() => metodosPagoTable.id),
  id_estado_factura: integer("id_estado_factura").notNull().references(() => estadosFacturaTable.id),
  id_usuario: integer("id_usuario").notNull().references(() => usuariosTable.id),
  id_plan_subscripcion: integer("id_plan_subscripcion").notNull().references(() => planesTable.id),
  id_subscripcion: integer("id_subscripcion").notNull().references(() => subscripcionesTable.id),
});

// Tabla Invitaciones_Subscripcion
export const invitacionesSubscripcionTable = sqliteTable("invitaciones_subscripcion", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre_invitado: text("nombre_invitado").notNull(),
  apellido_invitado: text("apellido_invitado").notNull(),
  correo_electronico_invitado: text("correo_electronico_invitado").notNull(),
  codigo: text("codigo").notNull().unique(),
  fecha_emision: integer("fecha_emision").notNull(),
  fecha_vencimiento: integer("fecha_vencimiento").notNull(),
  id_subscripcion: integer("id_subscripcion").notNull().references(() => subscripcionesTable.id),
  id_estado_invitaciones: integer("id_estado_invitaciones").notNull().references(() => estadosInvitacionTable.id),
});

// Tabla Metodos_Pago
export const metodosPagoTable = sqliteTable("metodos_pago", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion").notNull(),
  enlace_plataforma: text("enlace_plataforma").unique(),
});

// Tabla Planes
export const planesTable = sqliteTable("planes", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  costo: integer("costo").notNull(),
  cantidad_interacciones_mes: integer("cantidad_interacciones_mes").notNull(),
  cantidad_usuarios_permitidos: integer("cantidad_usuarios_permitidos").notNull(),
  cantidad_cuentas_permitidas: integer("cantidad_cuentas_permitidas").notNull(),
  descripcion: text("descripcion"),
  paypal_plan_id: text("paypal_plan_id").notNull(),
  id_estado_plan: integer("id_estado_plan").notNull().references(() => estadosPlanTable.id),
  id_tipo_facturacion: integer("id_tipo_facturacion").notNull().references(() => tiposFacturacionTable.id),
});

// Tabla Proveedores_Autenticacion
export const proveedoresAutenticacionTable = sqliteTable("proveedores_autenticacion", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  enlace: text("enlace").notNull().unique(),
  activo: integer("activo").notNull().default(1),
});

// Tabla Redes_Sociales
export const redesSocialesTable = sqliteTable("redes_sociales", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
  enlace_logo: text("enlace_logo"),
  enlace_plataforma: text("enlace_plataforma").unique(),
  id_estado_red_social: integer("id_estado_red_social").notNull().references(() => estadosRedSocialTable.id),
});

// Tabla Reglas
export const reglasTable = sqliteTable("reglas", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  alias: text("alias").unique(),
  prompt: text("prompt").notNull(),
  id_regla_padre: integer("id_regla_padre"),
  id_tipo_regla: integer("id_tipo_regla").notNull().references(() => tiposReglaTable.id),
  id_cuenta: integer("id_cuenta").notNull().references(() => cuentasRedesSocialesTable.id),
}, (table) => {
  return {
    parentRefence: foreignKey({
      columns: [table.id_regla_padre],
      foreignColumns: [table.id]
    })
  }
});

// Tabla Subcategorias
export const subcategoriasTable = sqliteTable("subcategorias", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
  id_categoria: integer("id_categoria").notNull().references(() => categoriasTable.id),
});

// Tabla Subcategorias_Reglas
export const subcategoriasReglasTable = sqliteTable("subcategorias_reglas", {
  id_subcategoria: integer("id_subcategoria").notNull().references(() => subcategoriasTable.id),
  id_regla: integer("id_regla").notNull().references(() => reglasTable.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.id_subcategoria, table.id_regla] })
}));

// Continuación de la tabla Subscripciones
export const subscripcionesTable = sqliteTable("subscripciones", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  referencia_pago: text("referencia_pago"),
  fecha_adquisicion: integer("fecha_adquisicion").notNull(),
  costo: integer("costo").notNull(),
  nombre_plan: text("nombre_plan").notNull(),
  fecha_proximo_pago: integer("fecha_proximo_pago"),
  fecha_ultimo_pago: integer("fecha_ultimo_pago"),
  tipo_facturacion: text("tipo_facturacion").notNull(),
  id_propietario: integer("id_propietario").notNull().references(() => usuariosTable.id),
  id_metodo_pago: integer("id_metodo_pago").notNull().references(() => metodosPagoTable.id),
  id_estado_subscripcion: integer("id_estado_subscripcion").notNull().references(() => estadosSubscripcionTable.id),
  id_plan_subscripcion: integer("id_plan_subscripcion").notNull().references(() => planesTable.id),
});

// Tabla Tipos_Facturacion
export const tiposFacturacionTable = sqliteTable("tipos_facturacion", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
});

// Tabla Tipos_Regla
export const tiposReglaTable = sqliteTable("tipos_regla", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
});

// Tabla Tipos_Usuario
export const tiposUsuarioTable = sqliteTable("tipos_usuario", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
});

// Tabla Usuarios
export const usuariosTable = sqliteTable("usuarios", {
  id: integer("id", { mode: 'number' }).notNull().primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  apellido: text("apellido").notNull(),
  direccion: text("direccion"),
  correo_electronico: text("correo_electronico").notNull().unique(),
  llave_acceso: text("llave_acceso").notNull(),
  id_proveedor_autenticacion: integer("id_proveedor_autenticacion").notNull().references(() => proveedoresAutenticacionTable.id),
  id_tipo_usuario: integer("id_tipo_usuario").notNull().references(() => tiposUsuarioTable.id),
});

// Tabla Usuarios_Subscripciones
export const usuariosSubscripcionesTable = sqliteTable("usuarios_subscripciones", {
  id_usuario: integer("id_usuario").notNull().references(() => usuariosTable.id),
  id_subscripcion: integer("id_subscripcion").notNull().references(() => subscripcionesTable.id)
}, (table) => ({
  pk: primaryKey({ columns: [table.id_usuario, table.id_subscripcion] })
}));
