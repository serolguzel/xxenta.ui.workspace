import { Component, OnInit } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { ActivatedRoute } from '@angular/router';
import { Permission } from '../company.models';
import { AuthService, CoreService } from 'genesis-coreservice';
import { TranslocoModule } from '@jsverse/transloco';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-company-person-contacts',
  templateUrl: './company-person-contacts.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    TranslocoModule
  ]
})
export class CompanyPersonContactsComponent implements OnInit {
  dataSource: CustomStore;
  permission: Permission = <Permission>{}
  contactTypes: any[] = [
    { id: 'ReservationAuthorized', name: 'Reservation Authorized' },
    { id: 'InvoiceAuthorized', name: 'Invoice Authorized' },
    { id: 'ContractAuthorized', name: 'Contract Authorized' }
  ];
  constructor(
    private authService: AuthService,
    private coreService: CoreService,
    private activatedRoute: ActivatedRoute,
  ) { }
  
  ngOnInit(): void {
    this.setPermission();
    let companyId = this.activatedRoute.snapshot.params['companyId'];

    this.dataSource = new DataSourceBuilder(this.coreService)
      .load(`CompanyContactPerson/${companyId}`)
      .insert(`CompanyContactPerson/${companyId}`)
      .updateFullModel('CompanyContactPerson', "id")
      .remove('CompanyContactPerson')
      .setKey("id")
      .build();
  }

  onRowUpdating = (e: any) => {
    var assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }

  private setPermission() {
    this.authService.getPermissions().then((res: string[]) => {
      this.permission = <Permission>{
        create: res?.includes('Content.AgencyContact.Create'),
        update: res?.includes('Content.AgencyContact.Update'),
        trash: res?.includes('Content.AgencyContact.Trash')
      };
    });
  }

}
