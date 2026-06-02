export interface InvoiceModel {
  id: number;
  organizationId: number;
  amount: number;
  currency: string;
  dueDate: Date;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  createdAt: Date;
  updatedAt: Date;
}