import { Database } from "./database";
import { EventEntity } from "./event.entity";

export interface EventRepository {
    put(db: Database, entity: EventEntity) : Promise<EventEntity|undefined>
    get(db: Database, id: string) : Promise<EventEntity|undefined>
}

export class EventRepositoryImpl implements EventRepository {
    async put(db: Database, entity: EventEntity) : Promise<EventEntity|undefined> {
        return await db.put(entity)
    }
    async get(db: Database, id: string) : Promise<EventEntity|undefined> {
        return await db.get(id)
    }
}