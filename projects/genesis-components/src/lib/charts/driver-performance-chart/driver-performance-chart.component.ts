import { Component } from '@angular/core';
import { NgApexchartsModule } from "ng-apexcharts";
import colors from "tailwindcss/colors";
import { ChartOptions } from '../apex-chart-options';


@Component({
  selector: 'driver-performance-chart',
  templateUrl: './driver-performance-chart.component.html',
  styleUrls: ['./driver-performance-chart.component.scss'],
  standalone: true,
  imports:[NgApexchartsModule]
})
export class DriverPerformanceChartComponent {
    public chartOptions: Partial<ChartOptions> | any;
    constructor() {
        this.chartOptions = {
            series: [
                {
                    name: "Akaryakıt",
                    type: "column",
                    data: [35, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                    color: colors.sky['400'],
                    group: 'Km'
                },
                {
                    name: "Km",
                    type: "area",
                    data: [40, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                    color: colors.fuchsia['600'],
                },
                {
                    name: "Görev",
                    type: "line",
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                    color: colors.sky['600'],
                }
            ],
            chart: {
                animations: {
                    enabled: false,
                },
                height: 350,
                type: "line",
                stacked: false,
                zoom:{
                    enabled: false,
                },
                toolbar:{
                    show: false
                },
            },
            stroke: {
                width: [
                    0,
                    2,
                    5],
                curve: "smooth"
            },
            plotOptions: {
                bar: {
                    columnWidth: "10%",
                    borderRadiusApplication: 'around',
                }
            },
            dataLabels : {
                enabled        : true,
                enabledOnSeries: [2],
                background     : {
                    borderRadius: 2,
                    borderWidth: 0,
                },
            },
            fill: {
                opacity: [
                    0.6,
                    0.2,
                    1],
                gradient: {
                    inverseColors: false,
                    shade: "light",
                    type: "vertical",
                },
            },
            labels: [
                "Araç 1",
                "Araç 2",
                "Araç 3",
                "Araç 4",
                "Araç 5",
                "Araç 6",
                "Araç 7",
                "Araç 8",
                "Araç 9",
                "Araç 10",
                "Araç 11",
            ],
            markers: {
                size: 0
            },
            xaxis: {
                type: "category"
            },
            yaxis: {
                show: false
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: [
                    {
                        formatter: (val: string) => `: ${val} litre`,
                    },
                    {
                        formatter: (val: string) => `: ${val} km`,
                    },
                    {
                        formatter: (val: string) => `: ${val}`,
                    },
                ]
            }
        };
    }
}
