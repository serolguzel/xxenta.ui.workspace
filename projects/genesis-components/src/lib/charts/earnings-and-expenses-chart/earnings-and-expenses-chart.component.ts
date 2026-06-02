import {Component, Input, OnInit} from '@angular/core';
import {
    ApexAxisChartSeries, NgApexchartsModule
} from "ng-apexcharts";
import { ChartOptions } from '../apex-chart-options';

@Component({
  selector: 'earnings-and-expenses-chart',
  templateUrl: './earnings-and-expenses-chart.component.html',
  styleUrls: ['./earnings-and-expenses-chart.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule]
})
export class EarningsAndExpensesChartComponent implements OnInit{
    @Input() data: ApexAxisChartSeries;
    public chartOptions: Partial<ChartOptions> | any;

    ngOnInit() {
        this.chartOptions = {
            series: this.data,
            chart: {
                animations: {
                    enabled: false,
                },
                height: 365,
                type: "area",
                zoom:{
                    enabled: false,
                },
                toolbar:{
                    show: false
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "smooth",
                width: [4,3],
            },
            fill: {
                opacity: [1, 0.2],
                gradient:{
                    opacityFrom: [0.35, 0.40],
                    opacityTo: 0,
                    stops:[65,100]
                }
            },
            labels: [
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
            ],
            markers: {
                size: 0
            },
            yaxis:{
                labels:{
                    formatter : (val: string) => `${val} €`
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function(y: number) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(0) + " €";
                        }
                        return y;
                    }
                }
            }
        };
    }
}
