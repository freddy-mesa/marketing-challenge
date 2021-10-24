import { Database } from "./database";
import { EventEntity } from "./event.entity";

export interface EventRepository {
    put(db: Database, entity: EventEntity) : Promise<EventEntity|undefined>
    get(db: Database, id: string) : Promise<EventEntity|undefined>
}

export class EventRepositoryImpl implements EventRepository {
    put = async(db: Database, entity: EventEntity) : Promise<EventEntity|undefined> => {
        return await db.put(entity)
    }
    get = async(db: Database, id: string) : Promise<EventEntity|undefined> => {
        return await db.get(id)
    }
}