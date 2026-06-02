import {
    AmountType,
    BaseEntityModel,
    BookingBaseModel, BookingType,
    GuestTitle,
    GuestType,
    IdNameCodePair, IdNamePair,
    TransferRouteType,
    UserLookupModel
} from "genesis-coreservice";
import { VehicleLookupModel } from "../../../airport-planning";

export interface CreateReservation {
    adult: number;
    child: number;
    infant: number;
    guests: ReservationGuestBaseModel[];
    bookings: CreateReservationModel[];
}

export interface UpdateReservation {
    oprVoucher: string | null;
    subVoucher: string | null;
    externalProvider: string | null;
    operatorId: string;
    transferDate: string;
    saleDate: string | null;
    bookingType: BookingType;
    transferRouteType: TransferRouteType | null;
    transferTypeId: number | null;
    flightCode: string | null;
    flightDate: string | null;
    departureTime: string | null;
    arrivalTime: string | null;
    terminalCode: string | null;
    adult: number;
    child: number;
    infant: number;
    pickupTime: string | null;
    fromLocation: LocationModel;
    toLocation: LocationModel;
    purchaseAmount: number | null;
    saleAmount: number | null;
    currency: string | null;
    reservationExtras: string[] | null;
    guests: ReservationGuestModel[];
}

export interface ReservationGuestBaseModel {
    id?: string;
    title: GuestTitle;
    guestType: GuestType;
    firstName: string;
    lastName: string;
    phoneAreaCode: string | null;
    phoneNumber: string | null;
    email: string | null;
    birthDate: string | null;
    transferOrder: string | null;
    idOrPassportNo: string | null;
    nationality: string | null;
    isLead: boolean;
}

export interface ReservationGuestModel extends ReservationGuestBaseModel {
    noShow: boolean;
    selfTransfer: boolean;
    isDeskOn: boolean;
    isGetOn: boolean;
    noShowDate: string | null;
    deskOnDate: string | null;
    getOnDate: string | null;
    pickupTime: string | null;

    // ***
    profile: string;
}

export interface CreateReservationModel {
    oprVoucher: string | null;
    subVoucher: string | null;
    externalProvider: string | null;
    operatorId: string;
    transferDate: string;
    saleDate: string | null;
    pickupTime: string | null;
    bookingType: BookingType;
    transferRouteType: TransferRouteType | null;
    transferTypeId: number | null;
    vehicleTypeId: number | null;
    flightCode: string | null;
    flightDate: string | null;
    departureTime: string | null;
    arrivalTime: string | null;
    terminalCode: string | null;
    fromLocation: LocationModel;
    toLocation: LocationModel;
    purchaseAmount: number | null;
    saleAmount: number | null;
    currency: string | null;
    reservationExtras: string[] | null;
    note: string | null;
}

export interface TransferExtraModel {
    extraId: string;
    name: string;
    tag: string;
    currency: string;
    purchaseAmount: number;
    saleAmount: number;
    description: string;
    amountType: AmountType;
}

export interface ReservationModel extends BookingBaseModel {
    adult: number;
    child: number;
    infant: number;
    purchaseAmount: number;
    saleAmount: number;
    currency: string | null;
    bookingType: BookingType;
    transferRouteType: TransferRouteType | null;
    isLock: boolean;
    cancel: boolean;
    saleDate: string;
    transferDate: string;
    cancelDate: string | null;
    pickupTime: string | null;
    transferType: IdNameCodePair<number> | null;
    vehicleType: IdNameCodePair<number> | null;
    fromLocation: LocationModel | null;
    toLocation: LocationModel | null;
    flight: ReservationFlightModel | null;
    operator: IdNameCodePair<string> | null;
    guests: ReservationGuestModel[];
    reservationExtras?: ExtraModel[] | null;
    return: ReferenceReservationModel | null;
}

export interface ReservationDetailModel extends ReservationModel {
    ownerId: string;
    beginTime: string | null;
    taskCode: string | null;
    qrCode: string;
    whatsappSupport: string | null;
    infoCocktailDate: string | null;
    infoCocktailTime: string | null;
    guide: UserLookupModel | null;
    createUser: UserLookupModel | null;
    vehicle: VehicleLookupModel | null;
}

export interface ReferenceReservationModel {
    id: string;
    transferDate: string;
    transferRouteType: TransferRouteType | null;
    flight: ReservationFlightModel;
}

export interface LocationModel extends BaseEntityModel {
    placeId: string;
    placeType: string | null;
    longitude: number | null;
    latitude: number | null;
    name: string | null;
    address: string | null;
    city: string | null;
    district: string | null;
    town: string | null;
    languageCode: string | null;
}

export interface ReservationFlightModel {
    flightCode: string;
    code: string;
    fromAirport: string;
    toAirport: string;
    flightDate: string;
    departureTime: string | null;
    arrivalTime: string | null;
    terminalCode: string | null;
    terminal: IdNamePair | null;
}

export interface ExtraModel {
    extraId: string;
    name: string;
    operatorId: string;
    tag: string;
    currency: string | null;
    purchaseAmount: number | null;
    saleAmount: number | null;
    description: string | null;
    amountType: AmountType;
    operator: IdNameCodePair<string> | null;
}

export interface ReservationExtraModel extends ExtraModel {
    id: number;
    isTaken: boolean;
    reservationId: string;
    operatorVoucher: string;
}