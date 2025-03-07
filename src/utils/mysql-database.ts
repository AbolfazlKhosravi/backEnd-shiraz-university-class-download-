import mysql from "mysql2";
import "dotenv/config";
 
const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: "Z",
  })
  .promise();

export default pool;
