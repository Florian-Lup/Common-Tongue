import { defineFunction } from "@aws-amplify/backend";

export const grammarFunction = defineFunction({
  name: "grammarAPI",
  environment: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "",
  },
  timeoutSeconds: 30,
  memoryMB: 512,
});
