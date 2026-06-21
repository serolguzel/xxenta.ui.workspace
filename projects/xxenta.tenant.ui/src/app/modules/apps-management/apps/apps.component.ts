import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import {
  GenesisCellDirective,
  GenesisColumn,
  GenesisDataTableComponent,
  OrganizationService,
} from 'genesis-components';
import { IdNamePair } from 'genesis-coreservice';
import { SubAppsComponentComponent } from '../sub-apps-component/sub-apps-component.component';
import { TenantService } from '../../services/tenant.service';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    TranslocoModule,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
    SubAppsComponentComponent,
  ],
  providers: [TenantService],
})
export class AppsComponent {
  private readonly organizationService = inject(OrganizationService);
  private readonly tenantService = inject(TenantService);
  private readonly translocoService = inject(TranslocoService);

  presentationTypes: IdNamePair[] = this.tenantService.presentationTypes;
  appTypes: string[] = this.organizationService.appTypes;

  columns: GenesisColumn[] = [
    { field: 'name', header: this.translocoService.translate('labels.name'), filter: true },
    { field: 'code', header: this.translocoService.translate('labels.code'), filter: true },
    { field: 'icon', header: this.translocoService.translate('labels.icon'), hidden: true },
    { field: 'link', header: this.translocoService.translate('labels.link'), hidden: true },
    { field: 'presentationType', header: this.translocoService.translate('labels.presentation-type') },
    { field: 'appType', header: this.translocoService.translate('labels.app-type') },
    { field: 'noShow', header: this.translocoService.translate('labels.no-show'), type: 'boolean' },
    { field: 'description', header: this.translocoService.translate('labels.description') },
  ];
}
