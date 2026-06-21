import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
  GenesisCellDirective,
  GenesisColumn,
  GenesisDataTableComponent,
  InvoiceTempComponent,
  OrganizationService
} from 'genesis-components';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TenantService } from '../services/tenant.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
    InvoiceTempComponent
  ],
  providers: [
    TenantService,
    OrganizationService
  ]
})
export class InvoicesComponent implements OnInit {
  private readonly organizationService = inject(OrganizationService);
  private readonly translocoService = inject(TranslocoService);

  @ViewChild('grid') grid!: GenesisDataTableComponent;

  currenciesDataSoruce = this.organizationService.weOrbisCurrencies;
  selectedItems: any[] = [];
  showSendEmailForm: boolean = false;

  columns: GenesisColumn[] = [];

  ngOnInit(): void {
    this.columns = [
      { field: 'app.name', header: this.translocoService.translate('labels.app') },
      { field: 'organization.name', header: this.translocoService.translate('labels.organization'), filter: true },
      { field: 'paymentDate', header: this.translocoService.translate('labels.payment-date'), type: 'date' },
      { field: 'paidDate', header: this.translocoService.translate('labels.paid-date'), type: 'date' },
      { field: 'unitPrice', header: this.translocoService.translate('labels.unit-price'), type: 'text' },
      { field: 'totalAmount', header: this.translocoService.translate('labels.total-amount'), type: 'text' },
      { field: 'currency', header: this.translocoService.translate('labels.currency') },
      { field: 'invoiceNumber', header: this.translocoService.translate('labels.invoice-number'), filter: true },
      { field: 'isPaid', header: this.translocoService.translate('labels.is-paid'), type: 'boolean' },
    ];
  }

  onRefresh(): void {
    this.grid.reload();
  }

  isSelected(row: any): boolean {
    return this.selectedItems.some(i => i.id === row.id);
  }

  toggleSelection(row: any): void {
    // single selection mode
    this.selectedItems = this.isSelected(row) ? [] : [row];
  }

  clearSelection = (): void => {
    this.selectedItems = [];
  };

  openSendEmailPopup = (): void => {
    this.showSendEmailForm = true;
  };

  sendEmail = (): void => {
    console.log('Sending emails for selected items:', this.selectedItems);
  };

  closePopupForm = (): void => {
    this.showSendEmailForm = false;
  };
}
