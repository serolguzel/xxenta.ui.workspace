import { IdNameCodePair } from "genesis-coreservice";
import { GuestModel } from "../../../airport-planning/models/airport.models";

export interface CreateFlightBooking {
    flights: CreateFlightBookingModel[];
    guests: FlightGuestModel[];
    voucher?: string;
}

export interface CreateFlightBookingModel {
    id: string | null;
    oprVoucher: string | null;
    externalProvider: string | null;
    voucher: string | null;
    operatorId: string;
    pnrNumber: string;
    fromAirport: string;
    toAirport: string;
    flightCode: string;
    departureDate: string;
    departureTime: string | null;
    arrivalTime: string | null;
    purchaseAmount: number;
    saleAmount: number;
    currency: string | null;
    routeType: RouteType;
}

export interface UpdateFlightBookingModel extends CreateFlightBookingModel {
    guests: FlightGuestModel[];
}

export enum RouteType {
    Arrival = 'Arrival',
    Departure = 'Departure',
}

export interface FlightGuestModel extends GuestModel {
    pnrNumber: string;
    profile?: string;
}

export interface FlightDateModel extends FlightRouteDetailModel {
    code: string;
    flightNumber: number;
    fromAirport: string;
    fromAirportName: string;
    toAirport: string;
    toAirportName: string;
    terminalCode: string;
    airlineCode: string;
}

export interface FlightRouteDetailModel {
    id: number;
    flightRouteId: number;
    date: string;
    departureTime: string | null;
    arrivalTime: string | null;
    estimatedTime: string | null;
    delay: number;
    provider: string;
}

export interface FlightBookingSingleModel extends CreateFlightBookingModel {
    guests: FlightGuestModel[];
    terminalCode: string | null;
    operator: IdNameCodePair<string> | null;
}