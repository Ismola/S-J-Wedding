import { validateEnvironment } from "@src/lib/validate-env";

// Validate environment on startup
validateEnvironment();

// Export for use in other files
export { validateEnvironment };
