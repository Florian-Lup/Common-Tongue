/**
 * Lambda function resource definition
 * Configures function name, environment variables, and resource allocation
 */
import { defineFunction } from "@aws-amplify/backend";

export const grammarFunction = defineFunction({
  name: "grammarapi",
  environment: {
    // API keys and configuration for external services
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "",
  },
  // Resource allocation settings
  timeoutSeconds: 300, // Maximum execution time
  memoryMB: 1024, // Allocated memory
});
