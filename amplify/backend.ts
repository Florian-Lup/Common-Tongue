// This is the main AWS Amplify backend configuration file
// It sets up the API Gateway and connects it to the Lambda function

// Import necessary AWS CDK and Amplify components
import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { grammarFunction } from "./functions/grammarAPI/resource";

/**
 * Main backend configuration for the Grammar API service
 * Sets up API Gateway with Lambda integration and CORS settings
 */

// Define the backend with the grammar function
const backend = defineBackend({
  grammarFunction,
});

// Create a dedicated CDK stack for API resources
const apiStack = backend.createStack("GrammarAPI");

/**
 * API Gateway configuration
 * Creates a REST API with CORS support and production deployment stage
 */
const api = new RestApi(apiStack, "GrammarRestApi", {
  restApiName: "grammarAPI",
  deploy: true,
  deployOptions: {
    stageName: "prod",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: [process.env.CORS_ORIGIN ?? "*"],
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "X-Amz-Date",
      "Authorization",
      "X-Api-Key",
      "X-Amz-Security-Token",
    ],
    allowCredentials: true,
  },
});

/**
 * Connect Lambda function to API Gateway
 * Creates integration between API endpoint and Lambda function
 */
const integration = new LambdaIntegration(
  backend.grammarFunction.resources.lambda
);

// Set up the /grammar endpoint that accepts POST requests
const grammarRoute = api.root.addResource("grammar");
grammarRoute.addMethod("POST", integration);

// Export API details (endpoint URL and region) for frontend use
backend.addOutput({
  custom: {
    API: {
      grammarAPI: {
        endpoint: api.url,
        region: Stack.of(apiStack).region,
      },
    },
  },
});

export default backend;
