import 'jest';
import { Database } from '../src/dao/database';
import { EventEntity } from '../src/dao/event.entity';
import { EventRepository, EventRepositoryImpl } from "../src/dao/event.repository"
import { MockDatabase } from "./mocks/database.mock"

describe('EventRepository', () => {
  let repository: EventRepository;
  let db: Database
  let item: EventEntity
  let resp: EventEntity | undefined

  beforeAll(() => {
    repository = new EventRepositoryImpl()
    db = new MockDatabase()
  })

  beforeEach(async() => {
    item = { id: "id-001", event: { example: "test" }, timestamp: Date.now() }
    await repository.put(db, item)
    resp = await repository.get(db, item.id)
  })
  it('Insert Event', () => {
    expect(resp).toBeDefined()
    expect(resp).toEqual(item)
  });
});