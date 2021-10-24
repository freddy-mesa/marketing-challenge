import 'jest';
import { PubSub } from '../src/sns/pub-sub';
import { EventTopic } from '../src/sns/event.topic';
import { EventProvider } from '../src/api/event.provider';
import { EventPublisher, EventPublisherImpl } from "../src/sns/event.publisher"
import { MockPublisher } from "./mocks/publisher.mock"

describe('EventPublisher', () => {
  let publisher: EventPublisher;
  let pubsub: PubSub

  beforeEach(() => {
    publisher = new EventPublisherImpl()
    pubsub = new MockPublisher()
  })

  it('Publish Event', async() => {
    const topicItem : EventTopic = { 
      Provider: EventProvider.MAILGUN.toString(), 
      timestamp: Date.now(), 
      type: "email opened" 
    }
    await publisher.publish(pubsub, topicItem)
  });
});