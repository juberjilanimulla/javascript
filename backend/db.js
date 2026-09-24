import mysql from "mysql2/promise";
import config from "./config.js";

// Create a connection pool (recommended over single connection)
const pool = mysql.createPool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

async function dbConnect() {
  try {
    const conn = await pool.getConnection();
    console.log("Database connected successfully");
    conn.release();
  } catch (error) {
    console.log("Unable to connect to MySQL", error);
    throw error;
  }
}

export { pool };
export default dbConnect;