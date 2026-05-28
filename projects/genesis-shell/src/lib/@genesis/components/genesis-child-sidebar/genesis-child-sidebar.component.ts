import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgClass } from '@angular/common';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenesisMediaWatcherService } from '../../services/media-watcher';
import { GenesisBreadcrumbsComponent } from '../genesis-breadcrumbs';
import { BreadcrumbsModel } from '../genesis-breadcrumbs/breadcrumbs.model';
import { ChildSidebarComponent } from './child-sidebar';
import { GenesisNavigationItem } from '../navigation/navigation.types';

@Component({
    selector: 'genesis-child-sidebar',
    templateUrl: './genesis-child-sidebar.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
    NgClass,
    CdkScrollable,
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    GenesisBreadcrumbsComponent,
    ChildSidebarComponent
],
})
export class GenesisChildSidebarComponent implements OnInit, OnDestroy {
    @Input() PageTitle: string = '';
    @Input() ShowPageTitle: boolean = false;
    @Input() SidebarTitle: string = '';
    @Input() ShowSidebarTitle: boolean = false;
    @Input() Breadcrumbs: Array<BreadcrumbsModel> = [];
    @Input() MenuData: GenesisNavigationItem[] = [];
    @Input() IsBgWhite: boolean = true;
    @Input() IsDefaultPadding: boolean = true;
    @Input() HideDrawer: boolean = false;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;

    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private genesisMediaWatcherService: GenesisMediaWatcherService,
    ) {}

    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }
    ngOnInit(): void {
        this.genesisMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    if(!this.HideDrawer)
                        this.drawerOpened = true;
                    else
                        this.drawerOpened = false;
                } else {
                    this.drawerMode = 'over';
                    if(!this.HideDrawer)
                        this.drawerOpened = false;
                }
            });
    }
}
