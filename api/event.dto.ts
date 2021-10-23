import { EventType } from "./event.type";

export interface EventDto {
    signature: EventSignatureDto
    "event-data": EventDataDto
}
export interface EventSignatureDto {
    token: string
    timestamp: string
    signature: string
}
export interface EventDataDto {
    id: string
    timestamp: number,
    "log-level": string,
    event: EventType,
    message: EventDataMessageDto,
    "recipient-domain": string
    geolocation: EventDataGeolocationDto
    "client-info": EventDataClientInfoDto
    campaings: EventDataCampaingListDto
    tags: string[]
    "user-variables": Object
}
export interface EventDataMessageDto {
    headers: EventDataMessageHeaderDto
}
export interface EventDataMessageHeaderDto {
    "message-id": string 
}
export interface EventDataGeolocationDto {
    country: string
    region: string,
    city: string
}
export interface EventDataClientInfoDto {
    "client-os": string
    "device-type": string
    "client-name": string
    "client-type": string
    "user-agent": string
}
export interface EventDataCampaingListDto {
    campaings: []
}
