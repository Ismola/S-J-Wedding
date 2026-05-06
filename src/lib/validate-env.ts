/**
 * Environment validation script
 * Run this on application startup to verify all required variables are configured
 */

function validateEnvironment() {
  const errors: string[] = [];
  const warnings: string[] = [];

  // MONGO_DB_NAME is always required.
  if (!import.meta.env.MONGO_URI?.trim()) {
    errors.push("Missing required variable: MONGO_URI");
  }

  // MONGO_DB_NAME is always required.
  if (!import.meta.env.MONGO_DB_NAME) {
    errors.push("Missing required variable: MONGO_DB_NAME");
  }

  // Check optional variables with defaults
  if (!import.meta.env.HOST) {
    warnings.push("HOST not set, using default: 0.0.0.0");
  }
  if (!import.meta.env.PORT) {
    warnings.push("PORT not set, using default: 80");
  }

  // Log results
  if (errors.length > 0 || warnings.length > 0) {
    console.log("\n========== Environment Validation ==========");

    if (errors.length > 0) {
      console.error("❌ ERRORS:");
      errors.forEach((error) => console.error(`  - ${error}`));
      console.error(
        "\nPlease ensure your .env file contains all required variables."
      );
      console.error(
        "Reference: .env.example\n"
      );
    }

    if (warnings.length > 0) {
      console.warn("⚠️  WARNINGS:");
      warnings.forEach((warning) => console.warn(`  - ${warning}`));
    }

    console.log("=".repeat(42) + "\n");

    if (errors.length > 0) {
      process.exit(1);
    }
  } else {
    console.log("✅ Environment variables validated successfully\n");
  }
}

export { validateEnvironment };
