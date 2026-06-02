export interface SummaryWidgetModel {
    count: number;
    completed: number;
}

export enum SummaryWidgetType{
    Summary = 'Summary',
    Overdue = 'Overdue',
    Issue = 'Issues',
    Feature = 'Feature'
}