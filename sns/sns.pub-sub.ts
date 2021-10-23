import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { PubSub } from "./pub-sub";
import { EventTopic } from "./event.topic";

export class SnsPubSub implements PubSub {
    private readonly snsApiVersion = ""
    private api: SNSClient = null
    constructor(private readonly topicName: string) {}
    private getClient() : SNSClient {
        if (this.api) return this.api;
        this.api = new SNSClient({ 
            apiVersion: this.snsApiVersion,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: process.env.AWS_REGION,
            endpoint: process.env.LOCALSTACK ? process.env.LOCALSTACK : undefined,
        });
        return this.api
    }
    publish = async (event: EventTopic) => {
        try {
            const client = this.getClient()
            await client.send(new PublishCommand({
                TopicArn: this.topicName,
                Message: JSON.stringify(event)
            }));
        } catch (error) {
            console.log(error)
        }
    }

}