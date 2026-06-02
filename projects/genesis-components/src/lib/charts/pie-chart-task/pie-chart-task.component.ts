import { NgIf, NgClass } from '@angular/common';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { DxLoadPanelModule } from 'devextreme-angular';
import { ValueNamePair } from 'genesis-coreservice';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PieChartOptions } from '../apex-chart-options';


@Component({
  selector: 'pie-chart-task',
  templateUrl: './pie-chart-task.component.html',
  styleUrl: './pie-chart-task.component.scss',
  standalone: true,
  imports: [NgIf, NgApexchartsModule, DxLoadPanelModule, TranslocoModule, NgClass],
})
export class PieChartTaskComponent implements OnInit {
  @Input() data: ValueNamePair<number>[] = [];
  @Input() loadingVisible: boolean = true;
  count: number = 0;
  public chartOptions: Partial<PieChartOptions>;

  @HostBinding('attr.data-component-id')
  get hostId(): string {
    return this._uniqueId || (this._uniqueId = Math.random().toString(36).substring(2));
  }
  private _uniqueId: string;

  public async ngOnInit() {
    this.count = this.data.reduce((acc, curr) => acc + curr.value, 0);
    this.chartOptions = {
      series: this.data.map(d => d.value),
      chart: {
        type: "pie"
      },
      labels: this.data.map(d => d.name),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  public async setData(data: ValueNamePair<number>[]) {
    this.data = data;
    this.count = this.data.reduce((acc, curr) => acc + curr.value, 0);
    this.chartOptions = {
      series: this.data.map(d => d.value),
      chart: {
        width: 380,
        type: "pie"
      },
      labels: this.data.map(d => d.name),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}
