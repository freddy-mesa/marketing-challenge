import { EventEntity } from "./event.entity";

export interface Database {
    put(event: EventEntity) : Promise<EventEntity|undefined> 
    get(id: string) : Promise<EventEntity|undefined> 
}
