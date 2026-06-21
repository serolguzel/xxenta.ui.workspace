import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import {
  GenesisCellDirective,
  GenesisColumn,
  GenesisDataTableComponent,
  RoleResponse,
} from 'genesis-components';
import { TenantService } from '../../services/tenant.service';

@Component({
  selector: 'app-apps-navigations',
  templateUrl: './apps-navigations.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ],
  providers: [TenantService],
})
export class AppsNavigationsComponent implements OnInit {
  private readonly tenantService = inject(TenantService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  appId: string = '';
  loadPath: string = '';
  navigationTypes: string[] = ['aside', 'basic', 'collapsable', 'divider', 'group', 'spacer'];
  roles: RoleResponse[] = [];

  columns: GenesisColumn[] = [
    { field: 'title', header: this.translocoService.translate('labels.title') },
    { field: 'subtitle', header: this.translocoService.translate('labels.subtitle') },
    { field: 'type', header: this.translocoService.translate('labels.type') },
    { field: 'active', header: this.translocoService.translate('labels.active'), type: 'boolean' },
    { field: 'disabled', header: this.translocoService.translate('labels.disabled'), type: 'boolean' },
    { field: 'tootip', header: this.translocoService.translate('labels.tooltip') },
    { field: 'link', header: this.translocoService.translate('labels.link') },
    { field: 'icon', header: this.translocoService.translate('labels.icon') },
    { field: 'isDeleted', header: this.translocoService.translate('labels.is-deleted'), type: 'boolean' },
  ];

  ngOnInit(): void {
    this.appId = this.activatedRoute.snapshot.params['appId'];
    this.loadPath = `Navigation/${this.appId}`;

    this.tenantService.GetRoles().then((res: RoleResponse[]) => {
      this.roles = res;
      this.cdr.detectChanges();
    });
  }
}
