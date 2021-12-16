import { Knex } from "knex";
export declare const development: Knex.Config;
export declare const production: Knex.Config;
declare const config: Record<string, Knex.Config<any>>;
export default config;
