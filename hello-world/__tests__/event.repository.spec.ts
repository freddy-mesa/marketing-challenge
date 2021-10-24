import 'jest';
import { Database } from '../src/dao/database';
import { EventEntity } from '../src/dao/event.entity';
import { EventRepository, EventRepositoryImpl } from "../src/dao/event.repository"
import { MockDatabase } from "./mocks/database.mock"

describe('EventRepository', () => {
  let repository: EventRepository;
  let db: Database

  beforeEach(() => {
    repository = new EventRepositoryImpl()
    db = new MockDatabase()
  })
  it('Insert Event', async() => {
    let item : EventEntity = { id: "id-001", event: { example: "test" }, timestamp: Date.now() }
    await repository.put(db, item)
    let resp = await repository.get(db, item.id)
    item.id = "001"
    expect(resp).toBeDefined()
    expect(resp?.id).toBe(item.id)
  });
});