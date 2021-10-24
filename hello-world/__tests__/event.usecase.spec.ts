import 'jest';
import { PubSub } from '../src/sns/pub-sub';
import { EventTopic } from '../src/sns/event.topic';
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

  beforeEach(() => {
    pubsub = new MockPublisher()
    db = new MockDatabase()

    publisher = new EventPublisherImpl()
    repository = new EventRepositoryImpl()
  })

  describe('GetProviderUseCase', () => {
    it('Test Valid Provider', () => {
      const resp = GetProviderUseCase(eventDto)
      expect(resp).toBe(EventProvider.MAILGUN)
    });
    it('Test Invalid Provider', () => {
      var eventDto2 = eventDto
      eventDto2['event-data'].message.headers['message-id'] = "mail.receeve.com"
      const resp = GetProviderUseCase(eventDto)
      expect(resp).toBe(EventProvider.NONE)
    });
  });

  describe('SaveEventUseCase', () => {
    it('Test Save Event', async() => {
      const savedEntity = await SaveEventUseCase(db, repository, eventDto)
      expect(savedEntity).toBeDefined()
      expect(savedEntity?.id).toBeDefined()
      expect(savedEntity?.id).not.toBe('')
      const id = savedEntity?.id ?? ""
      const getEntity = await repository.get(db, id)
      expect(getEntity).toBeDefined()
      expect(getEntity?.id).toBe(id)
    });
  });

  describe('PublishEventUseCase', () => {
    it('Test Publish Event', async() => {
      PublishEventUseCase(pubsub, publisher, eventDto, EventProvider.MAILGUN)
    });
  });

});