import { type ResourcesConfig } from "aws-amplify";

export const amplifyConfig: ResourcesConfig = {
  API: {
    REST: {
      grammarAPI: {
        endpoint: import.meta.env.VITE_API_ENDPOINT || "",
        region: import.meta.env.VITE_AWS_REGION || "",
      },
    },
  },
};
