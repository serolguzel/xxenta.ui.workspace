import { ActionType, UserLookupModel } from "genesis-coreservice";

export interface ActivityTimeLineModel {
    entityName: string;
    entityId: string;
    actionType: ActionType;
    details: ActivityTimeLineDetailModel[];
    user: UserLookupModel;
    changeDate: string;
    ipAddress: string | null;
     description: string;
};

export interface ActivityTimeLineDetailModel {
    fieldName: string;
    oldValue: string;
    newValue: string;
    description: string;
}