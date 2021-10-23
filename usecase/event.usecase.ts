import { v4 as uuid } from 'uuid'

import { Database } from "../dao/database";
import { PubSub } from "../sns/pub-sub";

import { EventDto } from "../api/event.dto";
import { EventRepositoryCommand } from "../dao/event.repository.comand";
import { EventEntity } from "../dao/event.entity";

import { EventPublisher } from '../sns/event.publisher';
import { EventTopic } from '../sns/event.topic';
import { EventProvider } from '../api/event.provider';

const GetProviderUseCase = (event: EventDto) : EventProvider => {
    try {
        if (event['event-data']?.message?.headers["message-id"]) {
            const value = event['event-data'].message.headers["message-id"]
            if (value.endsWith('mailgun.org')) return EventProvider.Mailgun;
        }
    } catch (error) {
        console.log(error)
    }

    return EventProvider.None    
}

const SaveEventUseCase = async(db: Database, repository: EventRepositoryCommand, event: EventDto) => {
    const entity: EventEntity = {
        id: uuid(),
        timestamp: new Date(),
        event: event
    }
    await repository.put(db, entity)
}

const PublishEventUseCase = async(pubsub: PubSub, publisher: EventPublisher, event: EventDto, provider: EventProvider) => {
    const topic: EventTopic = {
        provider: provider,
        timestamp: new Date(),
        type: `mail ${event['event-data'].event.toString()}`
    }
    await publisher.publish(pubsub, topic)
}

export {
    GetProviderUseCase,
    SaveEventUseCase,
    PublishEventUseCase
}