// This is the main AWS Amplify backend configuration file
// It sets up the API Gateway and connects it to the Lambda function

// Import necessary AWS CDK and Amplify components
import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { grammarFunction } from "./functions/grammarAPI/resource";
import { processorFunction } from "./functions/grammarProcessor/resource";
import { statusFunction } from "./functions/grammarStatus/resource";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Duration } from "aws-cdk-lib";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";

/**
 * Main backend configuration for the Grammar API service
 * Sets up API Gateway with Lambda integration and CORS settings
 */

// Define the backend with all Lambda functions
const backend = defineBackend({
  grammarFunction,
  processorFunction,
  statusFunction,
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

// Add this after the existing API Gateway configuration
const grammarQueue = new Queue(apiStack, "GrammarQueue", {
  visibilityTimeout: Duration.seconds(300), // 5 minutes timeout
  retentionPeriod: Duration.days(1),
});

// Use the processor function from the backend definition
const processor = backend.processorFunction.resources.lambda;
processor.addEventSource(
  new SqsEventSource(grammarQueue, {
    batchSize: 1,
  })
);

// Grant the API Lambda permission to send messages to SQS
grammarQueue.grantSendMessages(backend.grammarFunction.resources.lambda);

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

// Create DynamoDB table and configure permissions
const resultsTable = new Table(apiStack, "GrammarResults", {
  partitionKey: { name: "requestId", type: AttributeType.STRING },
  timeToLiveAttribute: "ttl",
  removalPolicy: RemovalPolicy.DESTROY,
});

resultsTable.grantWriteData(processor);
resultsTable.grantReadData(backend.statusFunction.resources.lambda);

// Add environment variables
backend.processorFunction.addEnvironment(
  "RESULTS_TABLE",
  resultsTable.tableName
);
backend.grammarFunction.addEnvironment(
  "GRAMMAR_QUEUE_URL",
  grammarQueue.queueUrl
);

// Add status endpoint
const statusRoute = api.root.addResource("status");
statusRoute.addMethod(
  "GET",
  new LambdaIntegration(backend.statusFunction.resources.lambda)
);

export default backend;
