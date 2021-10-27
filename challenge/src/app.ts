import  { APIGatewayProxyEventV2 } from "aws-lambda"
import { Database } from './dao/database';
import { DynamoDBDatabase } from './dao/dynamo.database';
import { PubSub } from './sns/pub-sub';
import { SnsPubSub } from './sns/sns.pub-sub';

import { EventDto } from './api/event.dto'
import { EventProvider } from './api/event.provider';
import { EventRepositoryImpl } from './dao/event.repository';
import { EventPublisherImpl } from './sns/event.publisher';

import { 
    GetProviderUseCase, 
    SaveEventUseCase, 
    PublishEventUseCase 
  } from './usecase/event.usecase'

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * @param {string} event.resource - Resource path.
 * @param {string} event.path - Path parameter.
 * @param {string} event.httpMethod - Incoming request's method name.
 * @param {Object} event.headers - Incoming request headers.
 * @param {Object} event.queryStringParameters - query string parameters.
 * @param {Object} event.pathParameters - path parameters.
 * @param {Object} event.stageVariables - Applicable stage variables.
 * @param {Object} event.requestContext - Request context, including authorizer-returned key-value pairs, requestId, sourceIp, etc.
 * @param {Object} event.body - A JSON string of the request payload.
 * @param {boolean} event.body.isBase64Encoded - A boolean flag to indicate if the applicable request payload is Base64-encode
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 * @param {string} context.logGroupName - Cloudwatch Log Group name
 * @param {string} context.logStreamName - Cloudwatch Log stream name.
 * @param {string} context.functionName - Lambda function name.
 * @param {string} context.memoryLimitInMB - Function memory.
 * @param {string} context.functionVersion - Function version identifier.
 * @param {function} context.getRemainingTimeInMillis - Time in milliseconds before function times out.
 * @param {string} context.awsRequestId - Lambda request ID.
 * @param {string} context.invokedFunctionArn - Function ARN.
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * @returns {boolean} object.isBase64Encoded - A boolean flag to indicate if the applicable payload is Base64-encode (binary support)
 * @returns {string} object.statusCode - HTTP Status Code to be returned to the client
 * @returns {Object} object.headers - HTTP Headers to be returned
 * @returns {Object} object.body - JSON Payload to be returned
 * 
 */

const database: Database = new DynamoDBDatabase(process.env.DYNAMO_TABLE_NAME ?? "")
const pubsub: PubSub = new SnsPubSub(process.env.SNS_ARN_TOPIC_NAME ?? "") 

const lambdaHandler = async (event: APIGatewayProxyEventV2, _: any) => {
    let errorHandling: Error | undefined
    try {
        const data = JSON.parse(event.body ?? "") as EventDto
        const provider = GetProviderUseCase(data.signature)
        await SaveEventUseCase(database, new EventRepositoryImpl(), data)
        await PublishEventUseCase(pubsub, new EventPublisherImpl(), data, provider)

        return {
            "statusCode": 201,
            "body": JSON.stringify({
                message: `Event Processed`,
                data: data
            })
        };
    } catch (error) {
        errorHandling = error as Error
    }
        
    return {
        "statusCode": 404,
        "body": JSON.stringify({
            error: errorHandling?.message ?? "",
        })
    };
    
};

export {
    lambdaHandler
} 