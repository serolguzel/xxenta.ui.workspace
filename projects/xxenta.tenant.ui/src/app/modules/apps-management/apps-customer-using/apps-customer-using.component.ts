import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
  GenesisCellDirective,
  GenesisColumn,
  GenesisDataTableComponent,
} from 'genesis-components';
import { CoreService } from 'genesis-coreservice';

@Component({
  selector: 'app-apps-customer-using',
  templateUrl: './apps-customer-using.component.html',
  standalone: true,
  imports: [
    TranslocoModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ],
})
export class AppsCustomerUsingComponent implements OnInit {
  private readonly coreService = inject(CoreService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly translocoService = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  loadPath: string = '';
  appNames: Record<string, string> = {};

  columns: GenesisColumn[] = [
    { field: 'organization.name', header: this.translocoService.translate('labels.customer'), filter: true },
    { field: 'appId', header: this.translocoService.translate('labels.application') },
    { field: 'registerDate', header: this.translocoService.translate('labels.register-date'), type: 'date' },
  ];

  ngOnInit(): void {
    const appId = this.activatedRoute.snapshot.params['appId'];
    this.loadPath = `OrganizationApps/${appId}`;

    this.coreService.getCall('Apps/GetAppsLookup').then((apps: any) => {
      const list = Array.isArray(apps) ? apps : (apps?.data ?? []);
      this.appNames = list.reduce((acc: Record<string, string>, a: any) => {
        acc[a.id] = a.name;
        return acc;
      }, {});
      this.cdr.detectChanges();
    });
  }
}
