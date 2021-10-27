import { EventTopic } from "../../src/sns/event.topic";
import { PubSub } from "../../src/sns/pub-sub";

export class MockPublisher implements PubSub {
    publish = async(event: EventTopic): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}