import { TransferRouteType, UserLookupModel } from "genesis-coreservice";
import { VehicleLookupModel } from "../../../airport-planning";

export interface ChangeMultipleTerminalModel {
    flightCode: string;
    transferDate: string;
    terminalCode: string;
    routeType: TransferRouteType;
}

export interface UpdateTransferReservationFlight {
    flightCode: string;
    flightDate: string;
    departureTime: string | null;
    arrivalTime: string | null;
}

export interface ReservationExcelExport {
    transferDate: string;
    operatorId: string | null;
}

export interface CancelReservationResponse {
    cancel: boolean;
    cancelNote: string;
    cancelDate: string;
}

export interface CancelReservation {
    cancel: boolean;
    cancelNote: string;
}

export interface GetTransferPlanByReservationResponse {
    id: string;
    taskCode: string;
    tag: string | null;
    beginTime: string | null;
    vehicle: VehicleLookupModel | null;
    driver: UserLookupModel | null;
}