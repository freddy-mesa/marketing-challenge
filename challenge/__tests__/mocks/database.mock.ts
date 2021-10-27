import { Database } from "../../src/dao/database";
import { EventEntity } from "../../src/dao/event.entity";

export class MockDatabase implements Database {
    private readonly data: Object = {}
    async put(event: EventEntity) : Promise<EventEntity|undefined> {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.data[event.id] = event
        return event
    }
    async get(id: string): Promise<EventEntity|undefined> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.data.hasOwnProperty(id) ? this.data[id] : undefined
    }
}