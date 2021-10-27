import 'jest';

import { PubSub } from '../src/sns/pub-sub';
import { EventProvider } from '../src/api/event.provider';
import { EventPublisher, EventPublisherImpl } from "../src/sns/event.publisher"
import { MockPublisher } from "./mocks/publisher.mock"

import { Database } from '../src/dao/database';
import { EventEntity } from '../src/dao/event.entity';
import { EventRepository, EventRepositoryImpl } from "../src/dao/event.repository"
import { MockDatabase } from "./mocks/database.mock"

import { GetProviderUseCase, SaveEventUseCase, PublishEventUseCase } from "../src/usecase/event.usecase"
import { EventDto } from '../src/api/event.dto';

describe('Event UseCases', () => {
  
  let publisher: EventPublisher;
  let pubsub: PubSub
  let repository: EventRepository;
  let db: Database

  const eventDto : EventDto = {
    "signature": {
      token: "e07070bc2a44e54881b6316ed3dca8da6e8b548f440808e486",
      timestamp: '1635114174',
      signature: '01e8197469adbc42b6aa6756a262fbc3f4ca45a81b6d56aa904df83648760d84'
    },
    'event-data': {
      id: 'Ase7i2zsRYeDXztHGENqRA',
      timestamp: 1521243339.873676,
      'log-level': 'info',
      event: 'clicked',
      message: { headers: { "message-id": "test.mailgun.org" }},
      recipient: 'alice@example.com',
      'recipient-domain': 'example.com',
      ip: '50.56.129.169',
      geolocation: { country: 'US', region: 'CA', city: 'San Francisco' },
      'client-info': {
        'client-os': 'Linux',
        'device-type': 'desktop',
        'client-name': 'Chrome',
        'client-type': 'browser',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31'
      },
      campaings: [],
      tags: [ 'my_tag_1', 'my_tag_2' ],
      'user-variables': { my_var_1: 'Mailgun Variable #1', 'my-var-2': 'awesome' }
    }
  }

  beforeAll(() => {
    pubsub = new MockPublisher()
    db = new MockDatabase()

    publisher = new EventPublisherImpl()
    repository = new EventRepositoryImpl()
  })

  describe('GetProviderUseCase Valid', () => {
    let provider: EventProvider
    beforeEach(() => {
      provider = GetProviderUseCase(eventDto.signature)
    })
    it('should be a valid provider', () => {
      expect(provider).toBeDefined()
      expect(provider).toEqual(EventProvider.MAILGUN)

    })
  });

  describe('GetProviderUseCase Invalid', () => {
    let provider: EventProvider
    beforeEach(() => {
      eventDto.signature.token = 'invalid'
      provider = GetProviderUseCase(eventDto.signature)
    })
    it('should be an invalid provider', () => {
      expect(provider).toBeDefined()
      expect(provider).toEqual(EventProvider.NONE)
    })
  });

  describe('SaveEventUseCase Valid', () => {
    let event1: EventEntity | undefined
    let event2: EventEntity | undefined
    beforeEach(async() => {
      event1 = await SaveEventUseCase(db, repository, eventDto)
      event2 = await repository.get(db, event1?.id ?? "")
    })
    it('should save event and get it', async() => {
      expect(event1).toBeDefined()
      expect(event1?.id).not.toEqual('')
      expect(event2).toBeDefined()
      expect(event2?.id).toEqual(event1?.id)
    });
  });

  describe('SaveEventUseCase Invalid', () => {
    let event1: EventEntity | undefined
    let event2: EventEntity | undefined
    beforeEach(async() => {
      event1 = await SaveEventUseCase(db, repository, eventDto)
      event2 = await repository.get(db, 'invalid')
    })
    it("should save event but don't get it", async() => {
      expect(event1).toBeDefined()
      expect(event1?.id).not.toEqual('')
      expect(event2).toBeUndefined()
    });
  });

  describe('PublishEventUseCase Valid', () => {
    it('should publish an event', async() => {
      PublishEventUseCase(pubsub, publisher, eventDto, EventProvider.MAILGUN)
    });
  });

});