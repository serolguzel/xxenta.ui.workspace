import { ActionType, GuestTitle, GuestType, IdNamePair, 
    TransferRouteType, UserLookupModel } from "genesis-coreservice";
import { LocationModel, ReservationGuestModel } from "../../reservation-management/transfer-reservations";

export interface GetTransferTaskStat {
    transferDate: string;
}

export interface AirportPlanningResponse {
    paxCount: number;
    reservationCount: number;
    cancelCount: number;
    noShowCount: number;
    selfTransferCount: number;
    completedGetOnCount: number;
}

export interface GetAirportTransferDetails {
    transferDate?: string;
    operatorId?: string | null;
    placeId?: string | null;
    flightCodes?: string[] | null;
    routeType?: TransferRouteType | null;
    searchText?: string | null;
}

export interface AirportPlanningResponse {
    paxCount: number;
    reservationCount: number;
    cancelCount: number;
    noShowCount: number;
    selfTransferCount: number;
    completedGetOnCount: number;
}


export interface AirportPlanningModel extends ReservationGuestModel {
    voucher: string;
    operatorId: string;
    transferDate: string;
    isGetOn: boolean;
    getOnTime: string | null;
    flight: TransferFlightModel;
    fromLocation: FromToModel;
    toLocation: FromToModel;
    items: AirportPlanningModel[];
}

export interface GuestModel {
    id: string | null;
    guestType: GuestType;
    title: GuestTitle;
    firstName: string;
    lastName: string;
    nationality: string | null;
    age: number;
    idOrPassportNo: string | null;
    phoneAreaCode: string;
    phoneNumber: string | null;
    email: string | null;
    operatorId: string;
    oprVoucher: string | null;
    externalProvider: string | null;
    voucher: string;
}

export interface TransferFlightModel {
    flightCode: string;
    fromAirport: string;
    toAirport: string;
    code: string;
    departureTime: string | null;
    arrivalTime: string | null;
    flightDate: string | null;
    arrivalDate: string | null;
    terminal: IdNamePair;
}

export interface FromToModel extends LocationModel {
    transferPlanLocationId: number;
    code: string | null;
    distanceMeter: number | null;
    duration: number | null;
    delay: number | null;
    regionCode: string | null;
    order: number;
    pickupTime: string | null;
    directionType: LocationDirectionType;
}

export enum LocationDirectionType {
    From = 'From',
    To = 'To'
}

export interface ReferenceTransferBooking {
    id: string;
    transferDate: string;
    transferRouteType: TransferRouteType;
    flightCode: string;
    flight: TransferFlightModel;
}

export interface VehicleLookupModel {
    id: string;
    plateCode: string;
    windowNumber: number;
    seat: number;
    driver: DriverBaseModel | null;
}

export interface DriverBaseModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
}

export interface TransferPlanExtraModel {
    extraId: string;
    isSelected: boolean;
    name: string;
    currency: string;
    saleAmount: number;
    description: string;
    voucher: string;
    operatorVoucher: string;
}

export interface GetAuditTrails {
    entityName: string;
    entityId: string;
    groupCode: string;
}

export interface TransferAuditTrailModel {
    entityName: string;
    entityId: string;
    actionType: ActionType;
    details: AuditTrailModel[];
    user: UserLookupModel;
    changeDate: string;
    ipAddress: string | null;
    description: string;
}

export interface AuditTrailModel {
    fieldName: string;
    oldValue: string;
    newValue: string;
    description: string;
}

export interface ChangeReservationGuestStatus {
    guestIds: string[];
    field: string;
    value: boolean;
}