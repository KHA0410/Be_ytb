import dotenv from "dotenv";
dotenv.config();

export default {
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DA_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
};
