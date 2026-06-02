import { BaseEntityModel } from "genesis-coreservice";

export interface TemplateDetailModel extends BaseEntityModel {
    code: string;
    title: string;
    language: string;
    body: string;
    ownerId: string | null;
    templateStatus: NotificationChannel[] | null;
    itemType: ItemOwnerType;
}


export enum ItemOwnerType {
    Default = 1,
    Client = 2
}

export enum NotificationChannel {
    SMS = 'SMS',
    EMAIL = 'EMAIL',
    PUSH = 'PUSH',
    INAPP = 'INAPP',
    WEBHOOK = 'WEHOOK',
    WHATSAPP = 'WHATSAPP',
    MICROSOFT_TEAMS = 'MICROSOFT_TEAMS',
    SLACK = 'SLACK'
}

export interface SendEmailEventRequest {
    displayName: string;
    title: string;
    body: string;
    emails: string[],
    receivers: EmailNamePair[];
}

export interface EmailNamePair {
    email: string | null;
    name: string | null;
}

export interface MailTemplateBaseModel {
    id: string | null;
    ownerId: string | null;
    isDefault: boolean;
    bodyHtml: string | null;
    header: string | null;
    footer: string | null;
}