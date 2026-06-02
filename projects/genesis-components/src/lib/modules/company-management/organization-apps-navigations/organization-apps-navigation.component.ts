import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DxDataGridModule, DxLookupModule, DxTemplateModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { IdNamePair } from 'genesis-coreservice';
import { OrganizationService } from '../services/organization.service';
import { NavigationModel } from '../company.models';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { filter, Subject, takeUntil } from 'rxjs';
import { DataSourceBuilder } from '../../../services/data-source-builder';

@Component({
  selector: 'app-organization-apps-navigation',
  templateUrl: './organization-apps-navigation.component.html',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxLookupModule,
    DxTemplateModule,
    MatIconModule,
    TranslocoModule
  ],
  providers: [
    OrganizationService
  ]
})
export class OrganizationAppsNavigationComponent implements OnInit, OnDestroy {
  dataSource: CustomStore;
  navigations: IdNamePair[] = [];
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) { }


  async ngOnInit(): Promise<void> {

    this.loadNavigationDetail();
    this.loadData();
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeAll),
    )
      .subscribe(() => {
        this.loadNavigationDetail();
        this.loadData();
      });
  }
  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  loadNavigationDetail() {
    let appId = this.activatedRoute.snapshot.params['appId'];
    this.organizationService.GetNavigationsByAppId(appId).then((res: NavigationModel[]) => {
      this.navigations = res.map(x => <IdNamePair>{
        id: x.id,
        name: x.title
      });
    });
  }
  loadData() {
    let organizationId = this.activatedRoute.snapshot.params['organizationId'];
    let appId = this.activatedRoute.snapshot.params['appId'];

    this.dataSource = new DataSourceBuilder(this.organizationService)
      .load(`OrganizationAppNavigation/${organizationId}`, { appId: appId })
      .insert(`OrganizationAppNavigation/${organizationId}`)
      .updateFullModel(`OrganizationAppNavigation/${organizationId}`)
      .remove(`OrganizationAppNavigation/${organizationId}`)
      .setKey('id')
      .build();
  }
  onRowUpdating = (e: any) => {
    const assign = (<any>Object).assign({}, e.oldData, e.newData);
    e.newData = assign;
  }

  onRowInserting = (e: any) => {
    e.data.organizationId = this.activatedRoute.snapshot.params['organizationId'];
  }

  onInitNewRow = (e: any) => {
    e.data.organizationId = this.activatedRoute.snapshot.params['organizationId'];
  }
}
