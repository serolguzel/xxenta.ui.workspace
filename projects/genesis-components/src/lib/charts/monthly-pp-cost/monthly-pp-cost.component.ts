import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import colors from "tailwindcss/colors";

@Component({
  selector: 'monthly-pp-cost',
  templateUrl: './monthly-pp-cost.component.html',
  styleUrls: ['./monthly-pp-cost.component.scss'],
  standalone: true,
  imports: [ChartModule],
  encapsulation: ViewEncapsulation.None
})
export class MonthlyPpCostComponent implements OnInit {
    chartData: any;
    chartOptions: any;

    private points = [
        { x: "Ocak", y: 7.8, goal: 8, over: false },
        { x: "Subat", y: 7, goal: 8, over: false },
        { x: "Mart", y: 8.8, goal: 8, over: true },
        { x: "Nisan", y: 9.1, goal: 8, over: true },
        { x: "Mayis", y: 7.1, goal: 8, over: false },
        { x: "Haziran", y: 6.53, goal: 8, over: false },
        { x: "Temmuz", y: 7.77, goal: 8, over: false },
        { x: "Agustos", y: 7.45, goal: 8, over: false },
        { x: "Eylul", y: 6.98, goal: 8, over: false },
        { x: "Ekim", y: 7.24, goal: 8, over: false },
        { x: "Kasim", y: 7.9, goal: 8, over: false },
        { x: "Aralik", y: 8.3, goal: 8, over: true },
    ];

    ngOnInit(): void {
        this.buildChart();
    }

    private buildChart(): void {
        const labels = this.points.map(p => p.x);
        this.chartData = {
            labels,
            datasets: [
                {
                    type: 'bar',
                    label: 'Maliyet',
                    data: this.points.map(p => p.y),
                    backgroundColor: this.points.map(p =>
                        p.over ? colors.red['700'] : colors.emerald['600']
                    ),
                    borderColor: this.points.map(p =>
                        p.over ? colors.red['700'] : colors.emerald['600']
                    ),
                    borderWidth: 1,
                    barPercentage: 0.6,
                },
                {
                    type: 'line',
                    label: 'Butce',
                    data: this.points.map(p => p.goal),
                    borderColor: colors.orange['500'],
                    backgroundColor: colors.orange['500'],
                    borderWidth: 2,
                    stepped: true,
                    pointRadius: 0,
                    fill: false,
                }
            ]
        };

        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                x: {},
                y: {}
            }
        };
    }
}
