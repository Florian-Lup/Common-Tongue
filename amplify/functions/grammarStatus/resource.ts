import { defineFunction } from "@aws-amplify/backend";

export const statusFunction = defineFunction({
  name: "grammarStatus",
  environment: {
    CORS_ORIGIN: process.env.CORS_ORIGIN || "",
  },
  timeoutSeconds: 30,
  memoryMB: 512,
});
