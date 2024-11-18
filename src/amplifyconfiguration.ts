import { Amplify } from "aws-amplify";

Amplify.configure({
  API: {
    REST: {
      grammarAPI: {
        endpoint: process.env.VITE_API_ENDPOINT as string,
        region: process.env.VITE_AWS_REGION as string,
      },
    },
  },
});
