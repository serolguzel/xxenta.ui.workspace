import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CoreService } from 'genesis-coreservice';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';

@Component({
  selector: 'app-organization-key-users',
  templateUrl: './organization-key-users.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ]
})
export class OrganizationKeyUsersComponent implements OnInit {
  private readonly coreService = inject(CoreService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  pageTitle: string = this.translocoService.translate('labels.key-users');
  basePath: string = '';
  users: any[] = [];

  columns: GenesisColumn[] = [
    { field: 'user.displayName', header: this.translocoService.translate('labels.user'), filter: true },
    { field: 'isDefault', header: this.translocoService.translate('labels.is-default'), type: 'boolean' },
    { field: 'isDeleted', header: this.translocoService.translate('labels.is-deleted'), type: 'boolean' },
  ];

  ngOnInit(): void {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    const pageTitleKey = this.activatedRoute.snapshot.data['pageTitle'];
    if (pageTitleKey) {
      this.pageTitle = this.translocoService.translate(pageTitleKey);
    }
    this.basePath = `OrganizationKeyUser/${organizationId}`;

    this.coreService.getCall(`User/GetUsersLookup/${organizationId}`, { requireTotalCount: true }).then((data: any) => {
      this.users = Array.isArray(data) ? data : (data?.data ?? []);
      this.cdr.detectChanges();
    });
  }
}
