import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

export interface EarningsSeries {
  name?: string;
  data: number[];
}

@Component({
  selector: 'earnings-and-expenses-chart',
  templateUrl: './earnings-and-expenses-chart.component.html',
  styleUrls: ['./earnings-and-expenses-chart.component.scss'],
  standalone: true,
  imports: [ChartModule],
})
export class EarningsAndExpensesChartComponent implements OnInit {
  @Input() data: EarningsSeries[] = [];

  public chartData: any;
  public chartOptions: any;

  private static readonly PALETTE: string[] = [
    '#42A5F5',
    '#66BB6A',
    '#FFA726',
    '#26C6DA',
    '#7E57C2',
    '#EC407A',
  ];

  ngOnInit(): void {
    this.buildChart();
  }

  setData(data: EarningsSeries[]): void {
    this.data = data;
    this.buildChart();
  }

  private buildChart(): void {
    const labels = [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık',
    ];

    // apex stroke.width [4,3] and fill.opacity [1, 0.2] map per series index
    const strokeWidths = [4, 3];
    const fillOpacities = [1, 0.2];
    const series = this.data ?? [];

    this.chartData = {
      labels,
      datasets: series.map((s, i) => {
        const color = EarningsAndExpensesChartComponent.PALETTE[i % EarningsAndExpensesChartComponent.PALETTE.length];
        return {
          type: 'line',
          label: s.name,
          data: s.data,
          borderColor: color,
          backgroundColor: this.withAlpha(color, fillOpacities[i] ?? 0.2),
          borderWidth: strokeWidths[i] ?? 3,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        };
      }),
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (ctx: any) => {
              const label = ctx.dataset?.label ? `${ctx.dataset.label}: ` : '';
              return `${label}${Number(ctx.parsed.y).toFixed(0)} €`;
            },
          },
        },
      },
      scales: {
        x: {
          type: 'category',
        },
        y: {
          ticks: {
            callback: (val: any) => `${val} €`,
          },
        },
      },
    };
  }

  private withAlpha(hex: string, alpha: number): string {
    const value = hex.replace('#', '');
    const r = parseInt(value.substring(0, 2), 16);
    const g = parseInt(value.substring(2, 4), 16);
    const b = parseInt(value.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
