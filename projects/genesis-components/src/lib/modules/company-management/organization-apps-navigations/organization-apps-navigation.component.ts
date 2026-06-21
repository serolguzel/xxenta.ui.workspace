import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { IdNamePair } from 'genesis-coreservice';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { filter, Subject, takeUntil } from 'rxjs';
import { GenesisCellDirective, GenesisColumn, GenesisDataTableComponent } from '../../../components/common';
import { NavigationModel } from '../company.models';
import { OrganizationService } from '../services/organization.service';

@Component({
  selector: 'app-organization-apps-navigation',
  templateUrl: './organization-apps-navigation.component.html',
  standalone: true,
  imports: [
    FormsModule,
    TranslocoModule,
    MatIconModule,
    CheckboxModule,
    FloatLabelModule,
    SelectModule,
    GenesisDataTableComponent,
    GenesisCellDirective,
  ],
  providers: [OrganizationService]
})
export class OrganizationAppsNavigationComponent implements OnInit, OnDestroy {
  private readonly organizationService = inject(OrganizationService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  loadPath: string = '';
  basePath: string = '';
  extraParams: any = {};
  newRowDefaults: any = {};

  navigations: IdNamePair[] = [];

  columns: GenesisColumn[] = [
    { field: 'navigation.title', header: 'labels.app', filter: true },
    { field: 'organization.name', header: 'labels.organization', filter: true },
    { field: 'active', header: 'labels.active', type: 'boolean' },
  ];

  ngOnInit(): void {
    this.loadNavigationDetail();
    this.loadData();
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeAll),
    ).subscribe(() => {
      this.loadNavigationDetail();
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  loadNavigationDetail(): void {
    const appId = this.activatedRoute.snapshot.params['appId'];
    this.organizationService.GetNavigationsByAppId(appId).then((res: NavigationModel[]) => {
      this.navigations = res.map(x => <IdNamePair>{ id: x.id, name: x.title });
      this.cdr.detectChanges();
    });
  }

  loadData(): void {
    const organizationId = this.activatedRoute.snapshot.params['organizationId'];
    const appId = this.activatedRoute.snapshot.params['appId'];

    this.basePath = `OrganizationAppNavigation/${organizationId}`;
    this.loadPath = this.basePath;
    this.extraParams = { appId: appId };
    this.newRowDefaults = { organizationId: organizationId, active: false };
  }
}
