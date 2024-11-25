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

// Create DynamoDB table first
const resultsTable = new Table(apiStack, "GrammarResults", {
  partitionKey: { name: "requestId", type: AttributeType.STRING },
  timeToLiveAttribute: "ttl",
  removalPolicy: RemovalPolicy.DESTROY,
});

// Create SQS queue
const grammarQueue = new Queue(apiStack, "GrammarQueue", {
  visibilityTimeout: Duration.seconds(300),
  retentionPeriod: Duration.days(1),
});

// Set up environment variables before creating API
backend.processorFunction.addEnvironment(
  "RESULTS_TABLE",
  resultsTable.tableName
);
backend.grammarFunction.addEnvironment(
  "GRAMMAR_QUEUE_URL",
  grammarQueue.queueUrl
);

// Configure processor with SQS event source
const processor = backend.processorFunction.resources.lambda;
processor.addEventSource(
  new SqsEventSource(grammarQueue, {
    batchSize: 1,
  })
);

// Grant permissions
resultsTable.grantWriteData(processor);
resultsTable.grantReadData(backend.statusFunction.resources.lambda);
grammarQueue.grantSendMessages(backend.grammarFunction.resources.lambda);

// Create API Gateway last
const api = new RestApi(apiStack, "GrammarRestApi", {
  restApiName: "grammarAPI",
  deploy: true,
  deployOptions: {
    stageName: "prod",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: [process.env.CORS_ORIGIN ?? "*"],
    allowMethods: ["POST", "GET", "OPTIONS"],
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

// Add API routes
const grammarRoute = api.root.addResource("grammar");
grammarRoute.addMethod(
  "POST",
  new LambdaIntegration(backend.grammarFunction.resources.lambda)
);

const statusRoute = api.root.addResource("status");
statusRoute.addMethod(
  "GET",
  new LambdaIntegration(backend.statusFunction.resources.lambda)
);

// Export API details
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
