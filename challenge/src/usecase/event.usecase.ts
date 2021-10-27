import { v4 as uuid } from 'uuid'

import { Database } from "../dao/database";
import { PubSub } from "../sns/pub-sub";

import { EventSignatureDto } from "../api/event.dto";
import { EventRepository } from "../dao/event.repository";
import { EventEntity } from "../dao/event.entity";
import { EventDto } from "../api/event.dto";
import { EventPublisher } from '../sns/event.publisher';
import { EventTopic } from '../sns/event.topic';
import { EventProvider } from '../api/event.provider';

import crypto from 'crypto'

const GetProviderUseCase = (reqSignature: EventSignatureDto) : EventProvider => {
    const encodedSignature = crypto
        .createHmac('sha256', process.env.MAILGUN_SIGNING_KEY || "")
        .update(reqSignature.timestamp.concat(reqSignature.token))
        .digest('hex')
    
    return (encodedSignature === reqSignature.signature) ? 
        EventProvider.MAILGUN 
        : EventProvider.NONE
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
