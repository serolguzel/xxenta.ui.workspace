import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ApexXAxis, NgApexchartsModule } from "ng-apexcharts";
import colors from "tailwindcss/colors";
import { ChartOptions, MostSeller } from '../apex-chart-options';

@Component({
  selector: 'fullness-rate',
  templateUrl: './fullness-rate.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports:[NgApexchartsModule],
})
export class FullnessRateComponent {
    @Input() data: MostSeller[] = [];
    targetPax = 100;
    public chartOptions: Partial<ChartOptions>;
    constructor() {
        const data = [{
            title: 'Vito',
            pax: 255,
            capacity: 6,
            voyage:58,
            total: 348
        },{
            title: 'Mini',
            pax: 344,
            capacity: 12,
            voyage:45,
            total: 540
        },{
            title: 'Midi',
            pax: 356,
            capacity: 24,
            voyage:19,
            total: 456,
        },{
            title: 'Bus',
            pax: 678,
            capacity: 46,
            voyage:19,
            total: 874,
        }]
        this.chartOptions = {
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: 32,
                },
            },
            chart: {
                height: 350,
                type: "bar",
                stacked: true, // Yığılmış bar grafiği
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
            fill: {
                colors: [colors.lime['500']]
            },
            xaxis: {
                max: 100,
                categories: data.map(item => `${item.title} (${item.voyage})`),
            },

            yaxis: {
                labels:{
                    style:{
                        fontSize: '14px',
                    }
                }
            },
            tooltip:{
                y:{
                    formatter: (value, opts: any) => {
                        const index  = (opts.dataPointIndex);

                        return `${data[index].pax} / ${data[index].total} pax`;
                    }
                }
            },
            series: [
                {
                    name: 'Doluluk',
                    data: data.map(item => ((item.pax / item.total) * 100).toFixed(2)) as any,
                }
            ],
            dataLabels:{
                style:{
                    colors: [colors.indigo['950']]
                }
            }
        };
    }

    public setData(data: MostSeller[]){
        this.data = data;
        this.mapData();
    }
    mapData() {
        this.chartOptions = {
            plotOptions: {
                bar: {
                    horizontal: true,
                    barHeight: 32,
                },
            },
            chart: {
                height: 350,
                type: "bar",
                stacked: true, // Yığılmış bar grafiği
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false
                },
                animations: {
                    enabled: false,
                },

            },
            fill: {
                colors: [colors.lime['500']]
            },
            xaxis: <ApexXAxis>{
                max: 100,
                categories: this.data.map(item => item.seller.displayName.substring(0, 3)),
            },

            yaxis: {
                labels: {
                    style: {
                        fontSize: '14px',
                    }
                }
            },
            tooltip: {
                y: {
                    formatter: (value, opts: any) => {
                        const index = (opts.dataPointIndex);
                        return `${this.data[index].pax} / ${this.data[index].total} pax`;
                    }
                }
            },
            series: [
                {
                    name: 'Pax',
                    data: this.data.map((item: any) => ((item.pax / this.targetPax) * 100).toFixed(2)) as any,
                }
            ],
            dataLabels: {
                style: {
                    colors: [colors.indigo['950']]
                }
            }
        };
    }

}
