import { defineFunction } from "@aws-amplify/backend";

export const grammarFunction = defineFunction({
  name: "grammarAPI",
  environment: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  },
  timeoutSeconds: 30,
  memoryMB: 512,
});
