import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivatedRoute } from '@angular/router';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { confirm } from 'devextreme/ui/dialog';
import { CoreService, Response, SnackbarService, Utility } from 'genesis-coreservice';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'lib-organization-currency',
  templateUrl: './organization-currency.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    TranslocoModule
  ]
})
export class OrganizationCurrencyComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  dataSource: CustomStore;
  currenciesDataSource: CustomStore;
  organizationId: string = '';
  codeNameTemplate = Utility.codeNameTemplate;
  constructor(
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService,
    private snackBar: SnackbarService) {
  }

  ngOnInit(): void {
    this.organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.currenciesDataSource = new DataSourceBuilder(this.coreService)
      .load('Currency/GetCurrenciesLookup')
      .byKey('Currency/GetCurrenciesLookup')
      .setKey("code")
      .build();

    this.dataSource = new DataSourceBuilder(this.coreService)
      .load(`OrganizationCurrency/${this.organizationId}`)
      .insert(`OrganizationCurrency/${this.organizationId}`)
      .setArrayKey(['organizationId', 'currencyCode'])
      .build();
  }

  deleteItem = (e: any) => {
    let confirmPopup = confirm('Silmek istediğinize emin misiniz?', "Emin misiniz?");
    confirmPopup.then((dialogResult) => {
      if (dialogResult) {
        this.coreService.deleteCall(`OrganizationCurrency/${this.organizationId}/${e.row.data.currencyCode}`).then((res: Response<boolean>) => {
          if (res) {
            if (res.message != undefined) {
              this.snackBar.Warning(res.message, "Dikkat");
            }
            this.dataGrid.instance.refresh();
          }
        });
      }
    });
  }

  onRowInserted = (e: any) => {
    if (e.data.message != undefined) {
      this.snackBar.Warning(e.data.message, "Dikkat");
    }
  }
}
