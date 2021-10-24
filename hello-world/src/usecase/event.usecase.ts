import { v4 as uuid } from 'uuid'

import { Database } from "../dao/database";
import { PubSub } from "../sns/pub-sub";

import { EventDto } from "../api/event.dto";
import { EventRepository } from "../dao/event.repository";
import { EventEntity } from "../dao/event.entity";

import { EventPublisher } from '../sns/event.publisher';
import { EventTopic } from '../sns/event.topic';
import { EventProvider } from '../api/event.provider';

const GetProviderUseCase = (event: EventDto) : EventProvider => {
    try {
        if (event['event-data']?.message?.headers["message-id"]) {
            const value = event['event-data'].message.headers["message-id"]
            if (value.endsWith('mailgun.org')) return EventProvider.MAILGUN;
        }
    } catch (error) {
        console.log(error)
    }

    return EventProvider.NONE    
}

const SaveEventUseCase = async(db: Database, repository: EventRepository, event: EventDto) : Promise<EventEntity|undefined>  => {
    const entity: EventEntity = {
        id: uuid(),
        timestamp: Date.now(),
        event: event
    }
    return await repository.put(db, entity)
}

const PublishEventUseCase = async(pubsub: PubSub, publisher: EventPublisher, event: EventDto, provider: EventProvider) => {
    const topic: EventTopic = {
        Provider: provider.toString(),
        timestamp: Date.now(),
        type: `email ${event['event-data'].event}`
    }
    await publisher.publish(pubsub, topic)
}

export {
    GetProviderUseCase,
    SaveEventUseCase,
    PublishEventUseCase
}
