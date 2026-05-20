import pg from "pg";
import "dotenv/config";

const requiredEnvVars = [
  "PG_USER",
  "PG_HOST",
  "PG_DATABASE",
  "PG_PORT",
  "PG_PASSWORD",
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`[Fatal] Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

const poolConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10),

  max: parseInt(process.env.PG_POOL_MAX || "20", 10),
  idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || "30000", 10),
  connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT || "2000", 10),
  statement_timeout: parseInt(process.env.PG_STMT_TIMEOUT || "10000", 10),
};

if (process.env.NODE_ENV === "production" || process.env.PG_SSL === "true") {
  poolConfig.ssl = {
    rejectUnauthorized: process.env.PG_SSL_REJECT_UNAUTHORIZED !== "false",
  };
}

const db = new pg.Pool(poolConfig);

db.on("error", (err, client) => {
  console.error("Unexpected error on idle database client:", err.message);
});

try {
  await db.query("SELECT 1");
  console.log("Database connected successfully and ready for queries.");
} catch (err) {
  console.error("Database connection failed on startup:", err.message);
  process.exit(1);
}

const handleShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing database pool...`);
  try {
    await db.end();
    console.log("Database pool has ended cleanly.");
    process.exit(0);
  } catch (err) {
    console.error("Error during database pool shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));

export const query = (text, params) => db.query(text, params);

export const transaction = async (callback) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export default db;
