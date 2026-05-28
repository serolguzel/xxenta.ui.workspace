import { NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Navigation } from '../../../core/navigation/navigation.types';

import { AppsService } from '../common/apps/apps.service';
import { IApps } from '../common/apps/apps.types';

import { GenesisLoadingBarComponent } from '../../../@genesis/components/loading-bar/loading-bar.component';
import { GenesisVerticalNavigationComponent } from '../../../@genesis/components/navigation/vertical/vertical.component';
import { ApplicationsComponent } from '../common/apps/apps.component';
import { LanguagesComponent } from '../common/languages/languages.component';
import { NotificationsComponent } from '../common/notifications/notifications.component';
import { ShortcutsComponent } from '../common/shortcuts/shortcuts.component';
import { UserComponent } from '../common/user/user.component';

import { APP_CONFIG_GEN, AuthService, GenesisLoadingService, IAppConfig, UserModel } from 'genesis-coreservice';
import { GenesisNavigationService } from '../../../@genesis/components/navigation/navigation.service';
import { GenesisMediaWatcherService } from '../../../@genesis/services/media-watcher/media-watcher.service';
import { NavigationService } from '../../../core/navigation/navigation.service';
import { GenesisChatAgentComponent } from '../common/chat-agent/chat-agent.component';
import { InvitationComponent } from '../common/invitation/invitation.component';
import { SearchComponent } from '../common/search/search.component';
import { GenesisFullscreenComponent } from '../../../@genesis/fullscreen/fullscreen.component';

@Component({
  selector: 'classy-layout',
  templateUrl: './classy.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    MatIconModule,
    MatButtonModule,
    RouterOutlet,

    GenesisLoadingBarComponent,
    GenesisVerticalNavigationComponent,
    InvitationComponent,
    NotificationsComponent,
    UserComponent,

    LanguagesComponent,
    ShortcutsComponent,
    ApplicationsComponent,
    SearchComponent,
    GenesisChatAgentComponent,
    GenesisFullscreenComponent
    // SearchComponent, 

    // MessagesComponent, 
    // QuickChatComponent
  ],
  providers: [
    GenesisLoadingService
  ]
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean;
  isAppsPanel: boolean = false;
  navigation: Navigation = <Navigation>{};
  user: UserModel = <UserModel>{};
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly navigationService: NavigationService,
    private readonly authService: AuthService,
    private readonly genesisMediaWatcherService: GenesisMediaWatcherService,
    private readonly genesisNavigationService: GenesisNavigationService,
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
