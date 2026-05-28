import { NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenesisLoadingBarComponent } from '../../../@genesis/components/loading-bar/loading-bar.component';
import { LanguagesComponent } from '../common/languages/languages.component';
import { SearchComponent } from '../common/search/search.component';
import { ShortcutsComponent } from '../common/shortcuts/shortcuts.component';
import { NotificationsComponent } from '../common/notifications/notifications.component';
import { UserComponent } from '../common/user/user.component';
import { Navigation } from '../../../core/navigation/navigation.types';
import { NavigationService } from '../../../core/navigation/navigation.service';
import { GenesisMediaWatcherService } from '../../../@genesis/services';
import { GenesisNavigationService, GenesisVerticalNavigationComponent } from '../../../@genesis/components';
import { GenesisHorizontalNavigationComponent } from '../../../@genesis/components/navigation/horizontal/horizontal.component';
import { APP_CONFIG_GEN, AuthService, IAppConfig, UserModel } from 'genesis-coreservice';
import { AppsService } from '../common/apps/apps.service';
import { IApps } from '../common/apps/apps.types';
import { GenesisChatAgentComponent } from '../common/chat-agent/chat-agent.component';
import { ApplicationsComponent, InvitationComponent } from "../../public-api";

@Component({
    selector: 'modern-layout',
    templateUrl: './modern.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
    GenesisLoadingBarComponent,
    NgIf,
    GenesisVerticalNavigationComponent,
    GenesisHorizontalNavigationComponent,
    MatButtonModule,
    MatIconModule,
    LanguagesComponent,
    SearchComponent,
    ShortcutsComponent,
    NotificationsComponent,
    NotificationsComponent,
    GenesisChatAgentComponent,
    UserComponent,
    RouterOutlet,
    ApplicationsComponent,
    InvitationComponent
],
})
export class ModernLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    isAppsPanel: boolean = false;
    private unsubscribeAll: Subject<any> = new Subject<any>();
    user: UserModel = <UserModel>{};
    /**
     * Constructor
     */
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private navigationService: NavigationService,
        private readonly authService: AuthService,
        private genesisMediaWatcherService: GenesisMediaWatcherService,
        private genesisNavigationService: GenesisNavigationService,
        private readonly appsService: AppsService,
        @Inject(APP_CONFIG_GEN) public appConfig: IAppConfig
    ) {
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }

    ngOnInit(): void {
 this.authService.getProfile().then((user: UserModel) => {
      this.user = user;
    });
        this.navigationService.navigation$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        this.genesisMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this.appsService.apps$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((apps: IApps[]) => {
                this.isAppsPanel = apps.length > 1;
            });
    }
    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    toggleNavigation(name: string): void {
        const navigation = this.genesisNavigationService.getComponent<GenesisVerticalNavigationComponent>(name);
        if (navigation) {
            navigation.toggle();
        }
    }
}
