import { ResourcesConfig } from "aws-amplify";

export const amplifyConfig: ResourcesConfig = {
  API: {
    REST: {
      grammarAPI: {
        endpoint: process.env.VITE_API_ENDPOINT || "",
        region: process.env.VITE_AWS_REGION || "",
      },
    },
  },
};
