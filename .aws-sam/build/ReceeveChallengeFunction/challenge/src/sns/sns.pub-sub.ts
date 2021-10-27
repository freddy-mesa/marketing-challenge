import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { PubSub } from "./pub-sub";
import { EventTopic } from "./event.topic";

export class SnsPubSub implements PubSub {
    private readonly snsApiVersion = "2010-03-31"
    private readonly client: SNSClient
    constructor(private readonly topicName: string) {
        this.client = this.getClient()
    }
    private getClient() : SNSClient {
        return new SNSClient({ 
            apiVersion: this.snsApiVersion,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
            },
            region: process.env.AWS_REGION,
        });
    }
    async publish(event: EventTopic) : Promise<void> {
        try {
            await this.client.send(new PublishCommand({
                TopicArn: this.topicName,
                Message: JSON.stringify(event)
            }));
        } catch (error) {
            console.log(error)
        }
    }
}