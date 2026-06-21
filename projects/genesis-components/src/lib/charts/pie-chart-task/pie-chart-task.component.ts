import { NgClass } from '@angular/common';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ValueNamePair } from 'genesis-coreservice';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'pie-chart-task',
  templateUrl: './pie-chart-task.component.html',
  styleUrl: './pie-chart-task.component.scss',
  standalone: true,
  imports: [NgClass, ChartModule, ProgressSpinnerModule, TranslocoModule],
})
export class PieChartTaskComponent implements OnInit {
  @Input() data: ValueNamePair<number>[] = [];
  @Input() loadingVisible: boolean = true;
  count: number = 0;

  chartData: any;
  chartOptions: any = {
    plugins: {
      legend: { position: 'bottom' }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  @HostBinding('attr.data-component-id')
  get hostId(): string {
    return this._uniqueId || (this._uniqueId = Math.random().toString(36).substring(2));
  }
  private _uniqueId: string;

  ngOnInit(): void {
    this.buildChart();
  }

  setData(data: ValueNamePair<number>[]): void {
    this.data = data;
    this.buildChart();
  }

  private buildChart(): void {
    this.count = this.data.reduce((acc, curr) => acc + curr.value, 0);
    this.chartData = {
      labels: this.data.map(d => d.name),
      datasets: [
        {
          data: this.data.map(d => d.value),
          backgroundColor: this.data.map((_, i) => PieChartTaskComponent.PALETTE[i % PieChartTaskComponent.PALETTE.length])
        }
      ]
    };
  }

  private static readonly PALETTE: string[] = [
    '#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2',
    '#EC407A', '#AB47BC', '#FFCA28', '#8D6E63', '#78909C'
  ];
}
