import { defineFunction } from "@aws-amplify/backend";

export const statusFunction = defineFunction({
  name: "grammarStatus",
  environment: {
    CORS_ORIGIN: process.env.CORS_ORIGIN || "",
    RESULTS_TABLE: process.env.RESULTS_TABLE || "",
  },
  timeoutSeconds: 30,
  memoryMB: 512,
});
