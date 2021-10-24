import { PubSub } from "./pub-sub";
import { EventTopic } from "./event.topic";

export interface EventPublisher {
    publish(pubsub: PubSub, event: EventTopic) : Promise<void>
}

export class EventPublisherImpl implements EventPublisher {
    publish = async(pubsub: PubSub, event: EventTopic) => {
        await pubsub.publish(event)
    }
}