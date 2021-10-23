import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { Database } from "./database";
import { EventEntity } from "./event.entity";

export class DynamoDBDatabase implements Database {
    private readonly dynamodbApiVersion = "2012-08-10"
    private api: DynamoDBClient = null
    constructor(private readonly tableName: string) { }
    private getClient = () : DynamoDBClient => {
        if (this.api) return this.api;
        this.api = new DynamoDBClient({ 
            apiVersion: this.dynamodbApiVersion,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: process.env.AWS_REGION,
            endpoint: process.env.LOCALSTACK ? process.env.LOCALSTACK : undefined,
        });
        return this.api;
    }
    put = async(entity: EventEntity) => {
        try {
            const client = this.getClient();
            await client.send(new PutItemCommand({
                TableName: this.tableName,
                Item: {
                    "Id": { S: entity.id },
                    "Event": { S: JSON.stringify(entity.event) },
                    "Timestamp": { S: entity.timestamp.toISOString() },
                },
            }));
        } catch (error) {
            console.log(error)
        }
    }
}