export interface SejourTransferProcessModel {
    id: string | null;
    ownerId: string;
    externalId: string;
    createDate: string | null;
    voucher: string;
    message: string;
    data: any | null;
}