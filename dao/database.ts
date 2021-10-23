import { EventEntity } from "./event.entity";

export interface Database {
    put(event: EventEntity)
}