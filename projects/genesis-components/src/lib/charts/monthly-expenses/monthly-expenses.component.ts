import {Component, Input, OnInit} from '@angular/core';
import {ApexAxisChartSeries, ApexOptions, NgApexchartsModule} from 'ng-apexcharts';

@Component({
  selector: 'monthly-expenses',
  templateUrl: './monthly-expenses.component.html',
  styleUrls: ['./monthly-expenses.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule]
})
export class MonthlyExpensesComponent implements OnInit{
    @Input() data: ApexAxisChartSeries = [];
    months: string[] = [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık",
    ]
    chartOptions: ApexOptions;

    ngOnInit() {
        this.chartOptions = {
            chart  : {
                animations: {
                    enabled: false,
                },
                height    : 80,
                type      : 'line',
                sparkline : {
                    enabled: true,
                },
            },
            series : this.data,
            stroke: {
                curve: "smooth",
                width: 4,
            },
            fill: {
                gradient:{
                    opacityFrom: 0.35,
                    opacityTo: 0,
                }
            },
            xaxis:{
                type: 'category'
            },
            tooltip:{
                fixed: {
                    enabled: true,
                    offsetX: 0,
                    offsetY: 0,
                },
                x:{
                    show: true,
                    formatter: (val) => this.months[(val as number) - 1],
                }
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `${val} %`,
                },
            },
        }
    }

}
