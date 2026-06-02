import {Component, Input} from '@angular/core';
import {DatePipe, NgFor, NgIf} from "@angular/common";
import { ActionType } from 'genesis-coreservice';
import { ActivityTimeLineModel } from './activity.models';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'activity-timeline',
  templateUrl: './activity-timeline.component.html',
  standalone: true,
  imports: [NgFor, DatePipe, NgIf, TranslocoModule]
})
export class ActivityTimelineComponent {
  @Input() data: ActivityTimeLineModel[] = [];
  @Input() showTitle: boolean = true;
  protected readonly ActionType = ActionType;
}
