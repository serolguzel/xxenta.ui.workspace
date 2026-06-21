import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import colors from "tailwindcss/colors";
import { MostSeller } from '../apex-chart-options';

@Component({
  selector: 'fullness-rate',
  templateUrl: './fullness-rate.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ChartModule],
})
export class FullnessRateComponent implements OnInit {
    @Input() data: MostSeller[] = [];
    targetPax = 100;

    chartData: any;
    chartOptions: any;

    private seedData = [
        { title: 'Vito', pax: 255, capacity: 6, voyage: 58, total: 348 },
        { title: 'Mini', pax: 344, capacity: 12, voyage: 45, total: 540 },
        { title: 'Midi', pax: 356, capacity: 24, voyage: 19, total: 456 },
        { title: 'Bus', pax: 678, capacity: 46, voyage: 19, total: 874 },
    ];

    ngOnInit(): void {
        this.buildChart();
    }

    public setData(data: MostSeller[]) {
        this.data = data;
        this.buildChart();
    }

    private buildChart(): void {
        if (this.data && this.data.length) {
            const labels = this.data.map((item: any) => item.seller.displayName.substring(0, 3));
            const values = this.data.map((item: any) => +((item.pax / this.targetPax) * 100).toFixed(2));
            const tooltipData = this.data;
            this.chartData = {
                labels,
                datasets: [
                    {
                        label: 'Pax',
                        data: values,
                        backgroundColor: colors.lime['500'],
                    }
                ]
            };
            this.chartOptions = this.makeOptions(tooltipData, (i) => `${tooltipData[i].pax} / ${tooltipData[i].total} pax`);
        } else {
            const data = this.seedData;
            const labels = data.map(item => `${item.title} (${item.voyage})`);
            const values = data.map(item => +((item.pax / item.total) * 100).toFixed(2));
            this.chartData = {
                labels,
                datasets: [
                    {
                        label: 'Doluluk',
                        data: values,
                        backgroundColor: colors.lime['500'],
                    }
                ]
            };
            this.chartOptions = this.makeOptions(data, (i) => `${data[i].pax} / ${data[i].total} pax`);
        }
    }

    private makeOptions(rows: any[], tooltipFormatter: (index: number) => string): any {
        return {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => tooltipFormatter(ctx.dataIndex),
                    }
                }
            },
            scales: {
                x: { max: 100 },
                y: {}
            }
        };
    }
}
