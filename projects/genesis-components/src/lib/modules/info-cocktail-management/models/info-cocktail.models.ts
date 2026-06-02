export interface CreateInfoCocktail {
    id: string;
    reservationIds: string[];
    hotelId: string;
    guideId: string;
    operatorId: string;
    supplierId: string;
    beginTime: string;
    endTime: string | null;
    date: string | null;
    guestIds: string[];
}