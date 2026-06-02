import { ActivityTimeLineDetailModel, ActivityTimeLineModel } from "../../../timelines/activity/activity.models";
import { AuditTrailModel, TransferAuditTrailModel } from "./airport.models";

export const auditTrail = {
    AuditTrailMap(x: TransferAuditTrailModel): ActivityTimeLineModel {
        return <ActivityTimeLineModel>{
            entityName: x.entityName,
            entityId: x.entityId,
            changeDate: x.changeDate,
            ipAddress: x.ipAddress,
            user: x.user,
            actionType: x.actionType,
            description: x.description,
            details: x.details?.map((y) => this.AuditTrailDetailMap(y)) ?? [],
        };
    },
    AuditTrailDetailMap(x: AuditTrailModel): ActivityTimeLineDetailModel {
        return <ActivityTimeLineDetailModel>{
            description: x.description,
            fieldName: x.fieldName,
            newValue: x.newValue,
            oldValue: x.oldValue,
        };
    },
};