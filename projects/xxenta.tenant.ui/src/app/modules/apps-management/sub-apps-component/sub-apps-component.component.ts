import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import {
  GenesisCellDirective,
  GenesisColumn,
  GenesisDataTableComponent,
  OrganizationService,
} from 'genesis-components';
import { IdNamePair } from 'genesis-coreservice';
import { TenantService } from '../../services/tenant.service';

@Component({
  selector: 'app-sub-apps-component',
  templateUrl: './sub-apps-component.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    CheckboxModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ],
  providers: [TenantService],
})
export class SubAppsComponentComponent implements OnInit {
  @Input() appId: string = '';

  private readonly organizationService = inject(OrganizationService);
  private readonly tenantService = inject(TenantService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);

  presentationTypes: IdNamePair[] = this.tenantService.presentationTypes;
  currencies: string[] = this.organizationService.weOrbisCurrencies;
  appTypes: string[] = this.organizationService.appTypes;

  columns: GenesisColumn[] = [
    { field: 'name', header: this.translocoService.translate('labels.name') },
    { field: 'code', header: this.translocoService.translate('labels.code') },
    { field: 'icon', header: this.translocoService.translate('labels.icon'), hidden: true },
    { field: 'link', header: this.translocoService.translate('labels.link'), hidden: true },
    { field: 'presentationType', header: this.translocoService.translate('labels.presentation-type') },
    { field: 'appType', header: this.translocoService.translate('labels.app-type') },
    { field: 'noShow', header: this.translocoService.translate('labels.no-show'), type: 'boolean' },
    { field: 'description', header: this.translocoService.translate('labels.description') },
  ];

  ngOnInit(): void {
    if (!this.appId) {
      this.appId = this.activatedRoute.snapshot.params['appId'];
    }
  }
}
