import { Database } from "./database";
import { EventEntity } from "./event.entity";

export interface EventRepositoryCommand {
    put(db: Database, entity: EventEntity) : Promise<void>
}

export class EventRepositoryCommandImpl implements EventRepositoryCommand {
    put = async(db: Database, entity: EventEntity) => {
        await db.put(entity)
    }
}