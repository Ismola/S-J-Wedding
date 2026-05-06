import { defineMiddleware } from "astro:middleware";
import { validateEnvironment } from "@src/lib/validate-env";

// Validate environment variables once on server startup
let envValidated = false;

export const onRequest = defineMiddleware((context, next) => {
  // Run validation once per server instance
  if (!envValidated) {
    validateEnvironment();
    envValidated = true;
  }

  return next();
});
