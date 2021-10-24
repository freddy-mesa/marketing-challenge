import { DynamoDBClient, PutItemCommand, GetItemCommand} from "@aws-sdk/client-dynamodb"
import { Database } from "./database";
import { EventEntity } from "./event.entity";

export class DynamoDBDatabase implements Database {
    private readonly dynamodbApiVersion = "2012-08-10"
    private readonly client: DynamoDBClient
    constructor(
        private readonly tableName: string,
        dynamoClient: DynamoDBClient | undefined = undefined
    ) {
        this.client = dynamoClient ?? this.getClient()
    }
    
    private getClient = () : DynamoDBClient => {
        return new DynamoDBClient({ 
            apiVersion: this.dynamodbApiVersion,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
            },
            region: process.env.AWS_REGION,
        });
    }
    get = async(id: string) : Promise<EventEntity|undefined> => {
        try {
            const response = await this.client.send(new GetItemCommand({
                TableName: this.tableName,
                Key: { "Id": { S: id} },
            }));
            var dynamoItem : EventEntity | undefined;
            if (response.Item) {
                dynamoItem =  {
                    id: response.Item["Id"].S ?? "",
                    event: JSON.parse(response.Item["Event"].S ?? ""),
                    timestamp: parseInt(response.Item["Timestamp"].N ?? ""),
                }
            }
            return dynamoItem
        } catch (error) {
            console.log(error)
        }
    }
    put = async(entity: EventEntity) : Promise<EventEntity|undefined> => {
        try {
            await this.client.send(new PutItemCommand({
                TableName: this.tableName,
                Item: {
                    "Id": { S: entity.id },
                    "Event": { S: JSON.stringify(entity.event) },
                    "Timestamp": { N: entity.timestamp.toString() },
                },
            }));
            return entity;
        } catch (error) {
            console.log(error)
        }

        return undefined;
    }
}
