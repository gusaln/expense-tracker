import { knex } from "knex";
import knexConfig from "../config/database";

const db = knex(knexConfig[process.env.NODE_ENV || "development"]);
// db.on("query", (ctx) => console.log({ sql: ctx.sql, bindings: ctx.bindings }));

export function isInvalidId(id: string | number) {
  return typeof id == "number" ? false : Number.isNaN(parseInt(id, 10));
}

export default db;
