import { NgFor, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { LangDefinition, TranslocoService } from '@jsverse/transloco';
import { take } from 'rxjs';
import { GenesisNavigationService } from '../../../../@genesis/components/navigation/navigation.service';
import { GenesisVerticalNavigationComponent } from '../../../../@genesis/components/navigation/vertical/vertical.component';
import { CoreService } from 'genesis-coreservice';

@Component({
  selector: 'languages',
  templateUrl: './languages.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'languages',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, NgTemplateOutlet, NgFor],
})
export class LanguagesComponent implements OnInit {
  availableLangs: LangDefinition[];
  activeLang: string;
  flagCodes: Record<string, string>;

  constructor(
    private readonly genesisNavigationService: GenesisNavigationService,
    private readonly translocoService: TranslocoService,
    private readonly coreService: CoreService
  ) { }

  ngOnInit(): void {
    const availableLangs = this.translocoService.getAvailableLangs();
    this.availableLangs = (availableLangs as (LangDefinition | string)[]).map((lang) => {
      return typeof lang === 'string' ? { id: lang, label: this.getLanguageLabel(lang) } : lang;
    });

    this.translocoService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
      this.updateNavigation(activeLang);
    });

    this.flagCodes = {
      'en-GB': 'gb',
      'de-DE': 'de',
      'nl-NL': 'nl',
      'tr-TR': 'tr',
    };
  }

  async setActiveLang(lang: string): Promise<void> {
    const request = {
      language: lang
    };

    await this.coreService.putCall('User/UpdateUserLanguage', request);

    this.translocoService.setActiveLang(lang);
    localStorage.setItem('userLanguage', lang);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  private updateNavigation(lang: string): void {
    const navComponent = this.genesisNavigationService.getComponent<GenesisVerticalNavigationComponent>('mainNavigation');

    if (!navComponent) {
      return;
    }

    const navigation = navComponent.navigation;

    const projectDashboardItem = this.genesisNavigationService.getItem('dashboards.project', navigation);
    if (projectDashboardItem) {
      this.translocoService.selectTranslate('Project').pipe(take(1))
        .subscribe((translation) => {
          projectDashboardItem.title = translation;
          navComponent.refresh();
        });
    }

    const analyticsDashboardItem = this.genesisNavigationService.getItem('dashboards.analytics', navigation);
    if (analyticsDashboardItem) {
      this.translocoService.selectTranslate('Analytics').pipe(take(1))
        .subscribe((translation) => {
          analyticsDashboardItem.title = translation;
          navComponent.refresh();
        });
    }
  }

  private getLanguageLabel(lang: string): string {
    const languageMap: Record<string, string> = {
      'en-GB': 'English',
      'de-DE': 'Deutsch',
      'nl-NL': 'Nederlands',
      'tr-TR': 'Türkçe',
    };

    return languageMap[lang] || lang;
  }
}

export interface ILanguageDropdownItem {
  key: string;
  value: string;
  icon?: string;
}
