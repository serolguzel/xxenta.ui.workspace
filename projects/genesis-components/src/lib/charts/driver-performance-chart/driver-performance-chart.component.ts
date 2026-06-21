import { Component, OnInit } from '@angular/core';
import colors from 'tailwindcss/colors';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'driver-performance-chart',
  templateUrl: './driver-performance-chart.component.html',
  styleUrls: ['./driver-performance-chart.component.scss'],
  standalone: true,
  imports: [ChartModule],
})
export class DriverPerformanceChartComponent implements OnInit {
  public chartData: any;
  public chartOptions: any;

  ngOnInit(): void {
    this.buildChart();
  }

  private buildChart(): void {
    const labels = [
      'Araç 1',
      'Araç 2',
      'Araç 3',
      'Araç 4',
      'Araç 5',
      'Araç 6',
      'Araç 7',
      'Araç 8',
      'Araç 9',
      'Araç 10',
      'Araç 11',
    ];

    this.chartData = {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Akaryakıt',
          data: [35, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
          backgroundColor: colors.sky['400'],
          borderColor: colors.sky['400'],
          barPercentage: 0.3,
          categoryPercentage: 0.7,
        },
        {
          type: 'line',
          label: 'Km',
          data: [40, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
          backgroundColor: this.withAlpha(colors.fuchsia['600'], 0.2),
          borderColor: colors.fuchsia['600'],
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        },
        {
          type: 'line',
          label: 'Görev',
          data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
          backgroundColor: colors.sky['600'],
          borderColor: colors.sky['600'],
          borderWidth: 5,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          type: 'category',
        },
        y: {
          display: false,
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
