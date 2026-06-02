import { UserLookupModel } from "genesis-coreservice";
import {
    ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill,
    ApexLegend, ApexMarkers, ApexNonAxisChartSeries, ApexPlotOptions,
    ApexResponsive,
    ApexTooltip,
    ApexXAxis, ApexYAxis
} from "ng-apexcharts";


export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis | ApexYAxis[];
    labels: string[];
    stroke: any; // ApexStroke;
    markers: ApexMarkers;
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    tooltip: ApexTooltip;
    colors?: string[];
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
};

export interface MostSeller {
    seller: UserLookupModel;
    pax: number | null;
    total: number | null;
}

export interface PieChartOptions {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};