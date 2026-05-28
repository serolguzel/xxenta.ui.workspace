import { Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { GenesisConfig } from '../@genesis/services/config/config.types';
import { Subject, combineLatest, filter, map, takeUntil } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DOCUMENT, NgIf } from '@angular/common';
import { GenesisMediaWatcherService } from '../@genesis/services/media-watcher/media-watcher.service';
import { GenesisPlatformService } from '../@genesis/services/platform/platform.service';
import { GENESIS_VERSION } from '../@genesis/version/genesis-version';
import { GenesisConfigService } from '../@genesis/services/config/config.service';
import { EmptyLayoutComponent } from './layouts/empty/empty.component';
import { ClassyLayoutComponent } from './layouts/classy/classy.component';
import { ModernLayoutComponent } from './layouts/modern/modern.component';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    EmptyLayoutComponent,
    // CenteredLayoutComponent, 
    // EnterpriseLayoutComponent, 
    // MaterialLayoutComponent, 
    ModernLayoutComponent,
    // ClassicLayoutComponent,
    ClassyLayoutComponent,
    // CompactLayoutComponent, 
    // DenseLayoutComponent, 
    // FuturisticLayoutComponent, 
    // ThinLayoutComponent, 
    // SettingsComponent
  ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  config: GenesisConfig;
  layout: string;
  scheme: 'dark' | 'light';
  theme: string;

  private unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * Constructor
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: any,
    private renderer2: Renderer2,
    private router: Router,
    private genesisConfigService: GenesisConfigService,
    private genesisMediaWatcherService: GenesisMediaWatcherService,
    private genesisPlatformService: GenesisPlatformService,
  ) {
  }

  ngOnInit(): void {
    combineLatest([
      this.genesisConfigService.config$,
      this.genesisMediaWatcherService.onMediaQueryChange$(['(prefers-color-scheme: dark)', '(prefers-color-scheme: light)']),
    ]).pipe(
      takeUntil(this.unsubscribeAll),
      map(([config, mql]) => {
        const options = {
          scheme: config.scheme,
          theme: config.theme,
        };
        // If the scheme is set to 'auto'...
        if (config.scheme === 'auto') {
          // Decide the scheme using the media query
          options.scheme = mql.breakpoints['(prefers-color-scheme: dark)'] ? 'dark' : 'light';
        }

        return options;
      }),
    ).subscribe((options) => {
      // Store the options
      this.scheme = options.scheme;
      this.theme = options.theme;

      // Update the scheme and theme
      this._updateScheme();
      this._updateTheme();
    });

    // Subscribe to config changes
    this.genesisConfigService.config$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((config: GenesisConfig) => {
        // Store the config
        this.config = config;
        // Update the layout
        this._updateLayout();
      });

    // Subscribe to NavigationEnd event
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.unsubscribeAll),
    ).subscribe(() => {
      // Update the layout
      this._updateLayout();
    });

    // Set the app version
    this.renderer2.setAttribute(this._document.querySelector('[ng-version]'), 'genesis-version', GENESIS_VERSION);

    // Set the OS name
    this.renderer2.addClass(this._document.body, this.genesisPlatformService.osName);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private _updateLayout(): void {
    // Get the current activated route
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    this.layout = this.config.layout;
    const layoutFromQueryParam = route.snapshot.queryParamMap.get('layout');
    if (layoutFromQueryParam) {
      this.layout = layoutFromQueryParam;
      if (this.config) {
        this.config.layout = layoutFromQueryParam;
      }
    }

    const paths = route.pathFromRoot;
    paths.forEach((path) => {
      // Check if there is a 'layout' data
      if (path.routeConfig && path.routeConfig.data && path.routeConfig.data.layout) {
        // Set the layout
        this.layout = path.routeConfig.data.layout;
      }
    });
  }

  /**
   * Update the selected scheme
   *
   * @private
   */
  private _updateScheme(): void {
    this._document.body.classList.remove('light', 'dark');
    this._document.body.classList.add(this.scheme);
  }

  private _updateTheme(): void {
    this._document.body.classList.forEach((className: string) => {
      if (className.startsWith('theme-')) {
        this._document.body.classList.remove(className, className.split('-')[1]);
      }
    });
    this._document.body.classList.add(this.theme);
  }
}
