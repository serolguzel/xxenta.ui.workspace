import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { API_CONFIG_GEN, ApiClientConfig, AuthService, CommandResponse, FileResponse } from 'genesis-coreservice';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { CreateOrganizationLogo } from '../company.models';
import { OrganizationService } from '../services/organization.service';

@Component({
  selector: 'app-organization-logos',
  templateUrl: './organization-logos.component.html',
  styleUrls: ['./organization-logos.component.scss'],
  standalone: true,
  imports: [
    TranslocoModule,
    FileUploadModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ]
})
export class OrganizationLogosComponent implements OnInit {
  @ViewChild('grid') grid!: GenesisDataTableComponent;
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  uploadUrl: string = '';
  loadPath: string = '';
  private token: string = '';
  private organizationId: string = '';

  columns: GenesisColumn[] = [
    { field: 'path', header: 'Preview' },
    { field: 'name', header: 'Name', filter: true },
    { field: 'logo', header: 'Logo' },
  ];

  constructor(
    @Inject(API_CONFIG_GEN) public config: ApiClientConfig,
    private organizationService: OrganizationService,
    private authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    this.token = await this.authService.getAccessToken();
    this.organizationId = this.activatedRoute.snapshot.params['organizationId'];
    this.loadPath = `OrganizationLogo/${this.organizationId}`;

    const organization = await this.organizationService.GetOrganizationsLookup(this.organizationId);
    const filename = organization.code;
    this.uploadUrl = `${this.config.apiHost}/FileUploader/Single/LOGOS/${organization.code}?fileName=${filename}`;
  }

  onBeforeSend(event: any): void {
    event.xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
  }

  onUploaded(event: { originalEvent: any }): void {
    const body = (event.originalEvent as HttpResponse<any>)?.body;
    const response = (typeof body === 'string' ? JSON.parse(body) : body) as FileResponse;
    if (response && !response.hasError) {
      this.organizationService.CreateOrganizationLogo(this.organizationId, <CreateOrganizationLogo>{
        name: response.filename,
        logo: response.filename
      }).then((_: CommandResponse<boolean>) => {
        this.fileUpload?.clear();
        this.grid?.reload();
      });
    }
  }
}
