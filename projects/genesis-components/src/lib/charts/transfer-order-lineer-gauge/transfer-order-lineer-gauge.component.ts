import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import moment from 'moment';
import {
  DistinctForLocationsModel,
  ExtendedTransferTaskModel,
  TransferTaskModel,
} from './transfer-order-lineer-gauge.models';
import { CodeNamePair } from 'genesis-coreservice';
import { GenesisAlertComponent } from 'genesis-shell';

@Component({
  selector: 'transfer-order-lineer-gauge',
  templateUrl: './transfer-order-lineer-gauge.component.html',
  styleUrls: ['./transfer-order-lineer-gauge.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    ProgressSpinnerModule,
    TranslocoModule,
    GenesisAlertComponent
  ],
})
export class TransferOrderLineerGaugeComponent implements OnInit {
  @Input() data: ExtendedTransferTaskModel[] = [];
  @Input() loadingVisible: boolean = false;

  hoveredLocation: string | null = null;

  ngOnInit(): void {

  }

  public setMappingData = (items: TransferTaskModel[]) => {
    if(!items)
      return;
    
    items.forEach((task) => {
      const allLocations = task.fromLocations.concat(task.toLocations)
        .map((item) => (<CodeNamePair>{
          name: item.name,
          code: item.regionCode, // kalsin
        }));
      this.data.push({
        ...task,
        percent: 50,
        counter: this.counter,
        allLocations: this.distinctForLocations(allLocations),
      });
    });
  }

  public counter(element: TransferTaskModel): number {
    const now = new Date();
    const startDate = new Date(element.beginTime);
    const endDate = moment(element.beginTime)
      .add(element.estimatedTime, 'm')
      .toDate();

    const date1 = moment(startDate);
    const date2 = moment(now);
    const diff = date2.diff(date1, 'minutes');

    if (endDate < now) {
      return 100;
    } else if (startDate > now) {
      return 0;
    } else {
      return (element.estimatedTime * diff) / 100;
    }
  }

  public distinctForLocations(items: CodeNamePair[]): DistinctForLocationsModel[] {
    return items
      .reduce((result: string[], item: CodeNamePair) => {
        if (!result.includes(item.code)) {
          result.push(item.code);
        }
        return result;
      }, [])
      .map((x) => ({
        code: x,
        name: x,
        hotels: items
          .filter((location) => location.code == x)
          .map((item) => item.name),
      }));
  }
}
