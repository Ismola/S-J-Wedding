/**
 * Environment variables validation and access
 * This module ensures all required environment variables are present
 * and provides type-safe access to them.
 */

interface EnvironmentVariables {
  MONGO_URI: string;
  MONGO_DB_NAME: string;
  HOST: string;
  PORT: string;
}

/**
 * Validate and retrieve environment variables
 */
function getEnvVariables(): EnvironmentVariables {
  const mongoUri = import.meta.env.MONGO_URI?.trim();
  const dbName = import.meta.env.MONGO_DB_NAME;
  const host = import.meta.env.HOST;
  const port = import.meta.env.PORT;

  const missing: string[] = [];

  if (!mongoUri) missing.push("MONGO_URI");
  if (!dbName) missing.push("MONGO_DB_NAME");

  if (missing.length > 0) {
    const missingVars = missing.join(", ");
    throw new Error(
      `Missing required environment variables: ${missingVars}. ` +
      `Please check your .env file or Docker environment configuration.`
    );
  }

  return {
    MONGO_URI: mongoUri,
    MONGO_DB_NAME: dbName,
    HOST: host || "0.0.0.0",
    PORT: port || "80",
  };
}

// Validate on module load
let env: EnvironmentVariables | null = null;

export function getEnv(): EnvironmentVariables {
  if (!env) {
    env = getEnvVariables();
  }
  return env;
}

/**
 * Get safe environment for logging (without sensitive data)
 */
export function getSafeEnvForLogging() {
  const env = getEnv();
  return {
    MONGO_URI: `${env.MONGO_URI.substring(0, 10)}...`,
    MONGO_DB_NAME: env.MONGO_DB_NAME,
    HOST: env.HOST,
    PORT: env.PORT,
  };
}
