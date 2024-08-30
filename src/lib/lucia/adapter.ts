import db from "../../db";
import { sessionTable, usuariosTable } from "../../db/schema/socialMood";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";


const adapter = new DrizzleSQLiteAdapter(db, sessionTable, usuariosTable);

export default adapter;
