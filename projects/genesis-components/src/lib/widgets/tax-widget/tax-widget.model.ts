export interface TaxWidgetModel {
    beginDate: Date;
    endDate: Date;
    amount: TotalAmount;
}

export interface TotalAmount {
    amount: number;
    currency: string;
}