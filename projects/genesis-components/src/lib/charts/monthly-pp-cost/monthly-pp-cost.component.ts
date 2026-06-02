import {Component, ViewEncapsulation} from '@angular/core';
import {
    NgApexchartsModule
} from "ng-apexcharts";
import colors from "tailwindcss/colors";
import { ChartOptions } from '../apex-chart-options';

@Component({
  selector: 'monthly-pp-cost',
  templateUrl: './monthly-pp-cost.component.html',
  styleUrls: ['./monthly-pp-cost.component.scss'],
  standalone: true,
  imports: [NgApexchartsModule],
  encapsulation: ViewEncapsulation.None
})
export class MonthlyPpCostComponent {
    public chartOptions: Partial<ChartOptions> | any;
    constructor() {
        this.chartOptions = {
            series: [
                {
                    name: "Maliyet",
                    data: [
                        {
                            x: "Ocak",
                            y: 7.8,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']
                                }
                            ]
                        },
                        {
                            x: "Subat",
                            y: 7,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 8,
                                    strokeColor: colors.orange['500']

                                }
                            ]
                        },
                        {
                            x: "Mart",
                            y: 8.8,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']

                                }
                            ],
                            fillColor: colors.red['700'],
                            strokeColor: colors.red['700'],
                        },
                        {
                            x: "Nisan",
                            y: 9.1,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']
                                }
                            ],
                            fillColor: colors.red['700'],
                            strokeColor: colors.red['700'],
                        },
                        {
                            x: "Mayis",
                            y: 7.1,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']
                                }
                            ]
                        },
                        {
                            x: "Haziran",
                            y: 6.53,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']
                                }
                            ]
                        },
                        {
                            x: "Temmuz",
                            y: 7.77,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']
                                }
                            ]
                        },
                        {
                            x: "Agustos",
                            y: 7.45,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']
                                }
                            ]
                        },
                        {
                            x: "Eylul",
                            y: 6.98,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']
                                }
                            ]
                        },
                        {
                            x: "Ekim",
                            y: 7.24,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']
                                }
                            ]
                        },
                        {
                            x: "Kasim",
                            y: 7.9,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']
                                }
                            ]
                        },
                        {
                            x: "Aralik",
                            y: 8.3,
                            goals: [
                                {
                                    name: "Butce",
                                    value: 8,
                                    strokeWidth: 10,
                                    strokeColor: colors.orange['500']
                                }
                            ],
                            fillColor: colors.red['700'],
                            strokeColor: colors.red['700'],
                        }
                    ]
                }
            ],
            chart: {
                height: 400,
                type: "bar",
                zoom:{
                    enabled: false,
                },
                toolbar:{
                    show: false
                },
                animations: {
                    enabled: false,
                },
            },
            plotOptions: {
                bar: {
                    columnWidth: "60%"
                }
            },
            fill: {
                opacity: 0.3,
                colors:[colors.emerald['600']]
            },
            stroke: {
                width: 1,
                colors:[colors.emerald['600']]
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: true,
                showForSingleSeries: true,
                customLegendItems: ["Maliyet", "Butce"],
                markers: {
                    fillColors: [colors.emerald['600'], colors.orange['500']],
                }
            },
            tooltip:{
                cssClass: 'removeGoalLabelMarker'
            }
        };
    }
}
