import { EventProvider } from "../api/event.provider";

export interface EventTopic {
    provider: EventProvider,
    timestamp: Date,
    type: string
}