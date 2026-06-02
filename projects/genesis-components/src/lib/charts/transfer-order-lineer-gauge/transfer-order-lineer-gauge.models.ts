import { CodeNamePair } from "genesis-coreservice";

export type DistinctForLocationsModel = CodeNamePair & {
    hotels: string[];
};

export type AdditionalDataForTransferTaskModel = {
    counter?: (item: TransferTaskModel) => number;
    allLocations: DistinctForLocationsModel[];
    percent: number;
};

export type ExtendedTransferTaskModel = TransferTaskModel & AdditionalDataForTransferTaskModel;

export interface TransferTaskModel {
    taskId: string;
    taskCode: string;
    beginTime: string;
    estimatedTime: number;
    totalPax: number;
    noShowTotal: number;
    selfTransferTotal: number;
    gotOnTotal: number;
    transferTypeId: string;
    vehicle: TransferTaskVehicle;
    fromLocations: LineerFromToModel[];
    toLocations: LineerFromToModel[];
}

export interface TransferTaskVehicle {
    windowNumber: number;
    plateCode: string;
}

export interface LineerFromToModel {
    id: string;
    transferPlanLocationId: number;
    placeId: string;
    latitude: number | null;
    longitude: number | null;
    name: string | null;
    placeType: string;
    distanceMeter?: number;
    duration?: number;
    delay?: number;
    toPlaceId?: string;
    regionCode: string; // kalsin
    pickupTime?: string;
    order: number;
    directionType: LineerLocationDirectionType;
}

export enum LineerLocationDirectionType {
    From = 'From',
    To = 'To'
}