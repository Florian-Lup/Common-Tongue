/**
 * Frontend configuration for AWS Amplify
 * Defines API endpoints and regions for client-side usage
 * Uses environment variables for dynamic configuration
 */
import { type ResourcesConfig } from "aws-amplify";

export const amplifyConfig: ResourcesConfig = {
  API: {
    REST: {
      grammarapi: {
        endpoint: import.meta.env.VITE_API_ENDPOINT || "",
        region: import.meta.env.VITE_AWS_REGION || "",
      },
    },
  },
};
