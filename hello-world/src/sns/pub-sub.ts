import { EventTopic } from "./event.topic";

export interface PubSub {
    publish(event: EventTopic) : Promise<void>
}