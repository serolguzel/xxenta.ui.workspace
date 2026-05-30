import { Component, OnInit, ViewChild } from '@angular/core';
import { TenantService } from '../services/tenant.service';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent, DxDataGridModule, DxPopupModule, DxTemplateModule } from 'devextreme-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder, InvoiceTempComponent, OrganizationService } from 'genesis-components';
import { DxiToolbarItemComponent } from "devextreme-angular/ui/toolbar";

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxPopupModule,
    DxTemplateModule,
    TranslocoModule,
    InvoiceTempComponent,
    DxiToolbarItemComponent
],
  providers: [
    TenantService,
    OrganizationService
  ]
})
export class InvoicesComponent implements OnInit {
  dataSource: CustomStore | undefined;
  @ViewChild(DxDataGridComponent, { static: false }) invoiceGrid: DxDataGridComponent;
  currenciesDataSoruce = this.organizationService.weOrbisCurrencies;
  refreshButtonOptions = {
    icon: 'refresh',
    onClick: this.onRefresh.bind(this)
  };
  selectedItems: any[] = [];
  showSendEmailForm: boolean = false;
  constructor(
    private organizationService: OrganizationService,
    private tenantService: TenantService
  ) {

  }
  ngOnInit(): void {
    this.dataSource = new DataSourceBuilder(this.tenantService)
      .load('OrganizationPayment/GetInvoices', { requireTotalCount: true })
      .updateFullModel('OrganizationPayment/UpdateInvoicePayment')
      .setKey("id")
      .build();
  }

  onRowUpdating = (e: any) => {
    e.newData = { ...e.oldData, ...e.newData };
  }

  selectionChangedHandler = (e: any) => {
    console.log(e.selectedRowsData);
    this.selectedItems = e.selectedRowsData;
  };
  onRefresh() {
    this.invoiceGrid.instance.refresh();
  }

  openSendEmailPopup = () => {
    console.log('Sending emails for selected items:', this.selectedItems);
    this.showSendEmailForm = true;
  }

  sendEmail = () => {
    console.log('Sending emails for selected items:', this.selectedItems);
  }

  clearSelection = () => {
    this.invoiceGrid.instance.clearSelection();
    this.selectedItems = [];
  }

  closePopupForm = () => {
    this.showSendEmailForm = false;
  }
}
