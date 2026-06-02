import { NgClass, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { DxDataGridModule, DxFileUploaderModule, DxProgressBarModule, DxTemplateModule, DxToolbarModule } from 'devextreme-angular';
import { API_CONFIG_GEN, ApiClientConfig, AuthService, CommandResponse, FileResponse } from 'genesis-coreservice';
import { OrganizationService } from '../services/organization.service';
import { CreateOrganizationLogo } from '../company.models';
import CustomStore from 'devextreme/data/custom_store';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-organization-logos',
  templateUrl: './organization-logos.component.html',
  styleUrls: ['./organization-logos.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    TranslocoModule,
    DxFileUploaderModule,
    DxProgressBarModule,
    DxToolbarModule,
    DxTemplateModule,
    DxDataGridModule
  ]
})
export class OrganizationLogosComponent implements OnInit {
  isUploaded = false;
  textVisible = true;
  progressVisible = false;
  progressValue = 0;
  uploadUrl: string = '';
  uploadHeaders: any = {};
  dataSource: CustomStore;
  constructor(
    @Inject(API_CONFIG_GEN) public config: ApiClientConfig,
    private organizationService: OrganizationService,
    private authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit() {
    let token = await this.authService.getAccessToken();
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    var organization = await this.organizationService.GetOrganizationsLookup(organizationId);
    var filename = organization.code;
    this.uploadUrl = `${this.config.apiHost}/FileUploader/Single/LOGOS/${organization.code}?fileName=${filename}`;
    this.uploadHeaders = {
      Authorization: `Bearer ${token}`,
    };
    this.loadData(organizationId);
  }

  onUploaded(e: any) {
    this.textVisible = true;
    this.progressValue = 0;
    this.isUploaded = true;
    if (e.message == 'Uploaded') {
      const organizationId = this.activatedRoute.snapshot.params['organizationId'];
      var response = JSON.parse(e.request.response) as FileResponse;
      if (!response.hasError) {
        this.organizationService.CreateOrganizationLogo(organizationId, <CreateOrganizationLogo>{
          name: response.filename,
          logo: response.filename
        }).then((res: CommandResponse<boolean>) => {
          this.loadData(organizationId);
        });

      }
    }
  }
  onUploadStarted(e: any) {
    this.isUploaded = false;
  }
  onProgress(e: any) {
    this.progressValue = (e.bytesLoaded / e.bytesTotal) * 100;
  }

  loadData(organizationId: string) {
    this.dataSource = new DataSourceBuilder(this.organizationService)
      .load(`OrganizationLogo/${organizationId}`)
      .insert(`OrganizationLogo/${organizationId}`)
      .setKey('id')
      .build();
  }
}
