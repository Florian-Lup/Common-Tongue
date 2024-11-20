import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { RestApi, LambdaIntegration, Cors } from "aws-cdk-lib/aws-apigateway";
import { grammarFunction } from "./functions/grammarAPI/resource";

const backend = defineBackend({
  grammarFunction,
});

// Create API Stack
const apiStack = backend.createStack("GrammarAPI");

// Create REST API
const api = new RestApi(apiStack, "GrammarRestApi", {
  restApiName: "grammarAPI",
  deploy: true,
  deployOptions: {
    stageName: "prod",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: ["*"],
  },
});

// Add Lambda integration
const integration = new LambdaIntegration(
  backend.grammarFunction.resources.lambda
);

// Add routes
const grammarRoute = api.root.addResource("grammar");
grammarRoute.addMethod("POST", integration);

// Add outputs
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