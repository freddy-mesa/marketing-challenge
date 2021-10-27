import { PubSub } from "./pub-sub";
import { EventTopic } from "./event.topic";

export interface EventPublisher {
    publish(pubsub: PubSub, event: EventTopic) : Promise<void>
}

export class EventPublisherImpl implements EventPublisher {
    async publish(pubsub: PubSub, event: EventTopic) : Promise<void> {
        await pubsub.publish(event)
    }
}