import { defineFunction } from "@aws-amplify/backend";

export const processorFunction = defineFunction({
  name: "grammarProcessor",
  environment: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    RESULTS_TABLE: process.env.RESULTS_TABLE || "",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "",
  },
  timeoutSeconds: 300,
  memoryMB: 1024,
});
