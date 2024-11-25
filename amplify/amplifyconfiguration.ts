/**
 * Frontend configuration for AWS Amplify
 * Defines API endpoints and regions for client-side usage
 * Uses environment variables for dynamic configuration
 */
import { type ResourcesConfig } from "aws-amplify";

// Utility function to remove trailing slash from URL
const removeTrailingSlash = (url: string) => url.replace(/\/$/, "");

export const amplifyConfig: ResourcesConfig = {
  API: {
    REST: {
      grammarapi: {
        endpoint: removeTrailingSlash(import.meta.env.VITE_API_ENDPOINT || ""),
        region: import.meta.env.VITE_AWS_REGION || "",
      },
    },
  },
};
