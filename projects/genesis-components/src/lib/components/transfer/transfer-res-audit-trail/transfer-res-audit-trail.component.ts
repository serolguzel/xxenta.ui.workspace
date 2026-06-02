import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

import { BadgeTaskStatusComponent } from '../../../badges/badge-taskstatus/badge-taskstatus.component';
import { ActivityTimelineComponent } from '../../../timelines/activity/activity-timeline.component';
import { ActivityTimeLineModel } from '../../../timelines/activity/activity.models';
import { ReservationModel } from '../../../modules/reservation-management';
import { UserLookupModel } from 'genesis-coreservice';

@Component({
    selector: 'transfer-res-audit-trail',
    templateUrl: './transfer-res-audit-trail.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        BadgeTaskStatusComponent,
        ActivityTimelineComponent,
        TranslocoModule
    ],
})
export class TransferResAuditTrailComponent {
    @Input() data: ReservationModel = <ReservationModel>{};
    @Input() createdUser: UserLookupModel;
    @Input() auditTrails: ActivityTimeLineModel[] = [];
    @Input() link: string = '';
}
