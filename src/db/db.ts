import { envServer } from "@/data/data/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(envServer.DATABASE_URL);
export const db = drizzle({ client: sql });
