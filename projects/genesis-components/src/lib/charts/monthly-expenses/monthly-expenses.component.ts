import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'monthly-expenses',
  templateUrl: './monthly-expenses.component.html',
  styleUrls: ['./monthly-expenses.component.scss'],
  standalone: true,
  imports: [ChartModule]
})
export class MonthlyExpensesComponent implements OnInit {
    @Input() data: any[] = [];
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
    ];

    chartData: any;
    chartOptions: any;

    private static readonly PALETTE: string[] = [
        '#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2',
        '#EC407A', '#AB47BC', '#FFCA28'
    ];

    ngOnInit() {
        this.buildChart();
    }

    public setData(data: any[]) {
        this.data = data;
        this.buildChart();
    }

    private buildChart(): void {
        const series = this.data || [];
        // Derive labels from the longest series' data length, mapped to month names.
        const maxLen = series.reduce((acc: number, s: any) => Math.max(acc, (s.data || []).length), 0);
        const labels = Array.from({ length: maxLen }, (_, i) => this.months[i] ?? `${i + 1}`);

        this.chartData = {
            labels,
            datasets: series.map((s: any, idx: number) => {
                const color = MonthlyExpensesComponent.PALETTE[idx % MonthlyExpensesComponent.PALETTE.length];
                return {
                    label: s.name,
                    data: (s.data || []).map((d: any) => (typeof d === 'object' && d !== null ? d.y : d)),
                    borderColor: color,
                    backgroundColor: color,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 4,
                };
            })
        };

        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: (ctx: any) => `${ctx.parsed.y} %`,
                    }
                }
            },
            scales: {
                x: {},
                y: {
                    ticks: {
                        callback: (val: any) => `${val} %`,
                    }
                }
            }
        };
    }
}
