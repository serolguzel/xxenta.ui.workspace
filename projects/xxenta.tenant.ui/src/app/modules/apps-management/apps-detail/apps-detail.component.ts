import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxFormComponent, DxFormModule, DxToolbarModule } from 'devextreme-angular';
import { AppsModel } from '../../services/models/tenant.models';
import { TenantService } from '../../services/tenant.service';
import { TranslocoModule } from '@jsverse/transloco';
import { OrganizationService } from 'genesis-components';

@Component({
  selector: 'app-apps-detail',
  templateUrl: './apps-detail.component.html',
  standalone: true,
  imports: [
    DxFormModule,
    DxToolbarModule,
    TranslocoModule
  ],
  
})
export class AppsDetailComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  app: AppsModel = <AppsModel>{};
  presentationTypes = this.tenantService.presentationTypes;
  currenciesDataSoruce = this.organizationService.weOrbisCurrencies;
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
    private readonly tenantService: TenantService,
    private readonly organizationService: OrganizationService,
    private readonly activatedRoute: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    let appId = this.activatedRoute.snapshot.params.appId;
    this.tenantService.GetAppById(appId).then((res: AppsModel) => {
      this.app = res;
    });
  }

  save() {
    const valid = this.form.instance.validate().isValid;
    if (valid) {
      this.tenantService.UpdateApps(this.app.id, this.app);
    }
  }

  cancel() {
    let appId = this.activatedRoute.snapshot.params.appId;
    this.tenantService.GetAppById(appId).then((res: AppsModel) => {
      this.app = res;
    });
  }
}
