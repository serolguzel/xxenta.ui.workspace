import { Component, OnInit, ViewChild } from '@angular/core';
import { OrganizationAccountingInfoDto } from '../../services/models/tenant.models';
import { TenantService } from '../../services/tenant.service';
import { DxFormComponent, DxFormModule, DxToolbarModule } from 'devextreme-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivatedRoute } from '@angular/router';
import { CommandResponse } from 'genesis-coreservice';

@Component({
  selector: 'app-organization-accounting-info',
  templateUrl: './organization-accounting-info.component.html',
  styleUrl: './organization-accounting-info.component.scss',
  standalone: true,
  imports: [
    DxFormModule,
    DxToolbarModule,
    TranslocoModule
  ],
  providers: [
    TenantService
  ]
})
export class OrganizationAccountingInfoComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  data: OrganizationAccountingInfoDto = <OrganizationAccountingInfoDto>{};
  btnSave = {
    icon: 'save',
    text: 'Save',
    type: "default",
    onClick: this.save.bind(this)
  };

  btnCancel = {
    icon: 'close',
    text: 'Cancel',
    onClick: this.cancel.bind(this)
  };

  constructor(
    private tenantService: TenantService,
    private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.data.organizationId = organizationId;
    this.loadData(organizationId);
  }
  loadData(organizationId: string) {
    this.tenantService.GetOrganizationAccountingInfo(organizationId).then((res) => {
      if (res) {
        this.data = res;
      }
    });
  }
  save() {
    const valid = this.form.instance.validate().isValid;
    if (valid) {
      if (this.data.id) {
        this.tenantService.UpdateOrganizationAccountingInfo(this.data).then((res: CommandResponse<string>) => {
          this.loadData(this.data.organizationId);
        });
      } else {
        this.tenantService.CreateOrganizationAccountingInfo(this.data).then((res: CommandResponse<string>) => {
          this.loadData(this.data.organizationId);
        });
      }
    }
  }

  cancel() {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.loadData(organizationId);
  }
}
