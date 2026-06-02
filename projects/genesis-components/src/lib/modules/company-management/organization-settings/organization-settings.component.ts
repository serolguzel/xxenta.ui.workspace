import { Component, OnInit, ViewChild } from '@angular/core';
import { OrganizationSettingsExcelImportComponent } from '../components/organization-settings-excel-import/organization-settings-excel-import.component';
import { OrganizationService } from '../services/organization.service';
import { OrganizationSettingsModel, SaveSettings } from '../company.models';
import { ActivatedRoute } from '@angular/router';
import { DxFormComponent, DxFormModule, DxToolbarModule } from 'devextreme-angular';
import { NgFor } from '@angular/common';
import { CommandResponse } from 'genesis-coreservice';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-organization-settings',
  templateUrl: './organization-settings.component.html',
  standalone: true,
  imports: [
    NgFor,
    DxFormModule,
    DxToolbarModule,
    OrganizationSettingsExcelImportComponent,
    TranslocoModule
  ],
  providers: [
    OrganizationService
  ]
})
export class OrganizationSettingsComponent implements OnInit {
  @ViewChild(DxFormComponent, { static: false }) form: DxFormComponent;
  settings: OrganizationSettingsModel[] = [];
  model: SaveSettings = <SaveSettings>{};
  btnSave = {
    icon: 'save',
    text: 'Save',
    type: "default",
    onClick: this.onSave.bind(this)
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private organizationService: OrganizationService
  ) {

  }
  ngOnInit(): void {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.organizationService.GetSettings(organizationId).then((res: OrganizationSettingsModel[]) => {
      this.settings = res;
    })
  }

  onSave() {
    var valid = this.form.instance.validate().isValid;
    if (valid) {
      let organizationId = this.activatedRoute.snapshot.params['organizationId'];
      this.organizationService.SaveSettings(organizationId, this.model).then((res: CommandResponse<number>) => {
        let map = <OrganizationSettingsModel>{
          id: res.aggregatorId,
          organizationId: organizationId,
          key: this.model.key,
          value: this.model.value
        };
        this.settings.push(map);
      });
    }
  }

  deleteItem(item: OrganizationSettingsModel) {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.organizationService.DeleteSettings(organizationId, item.key).then((res: CommandResponse<boolean>) => {
      if (res.aggregatorId) {
        const index = this.settings.findIndex(x => x.id == item.id);
        this.settings.splice(index, 1);
      }
    });
  }
}
