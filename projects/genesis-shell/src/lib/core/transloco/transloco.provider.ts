import { APP_INITIALIZER, inject, Provider } from '@angular/core';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { TranslocoHttpLoader } from './transloco.http-loader';
import { AuthService } from 'genesis-coreservice';

export const provideTranslocoShell = (): Provider[] => [
  provideTransloco({
    config: {
      availableLangs: ['en-GB', 'de-DE', 'nl-NL', 'tr-TR'],
      defaultLang: 'en-GB',
      fallbackLang: 'en-GB',
      reRenderOnLangChange: true,
      prodMode: true,
    },
    loader: TranslocoHttpLoader,
  }),
  {
    provide: APP_INITIALIZER,
    useFactory: () => {
      const authService = inject(AuthService);
      const translocoService = inject(TranslocoService);
      return async () => {
        const availableLangs = translocoService.getAvailableLangs() as string[];
        const defaultLang = translocoService.getDefaultLang();
        
        try {
          // Get user profile from token
          const profile = await authService.getProfile();
          // Language comes from the token now
          const profileLang = profile?.language;
          const storageLang = localStorage.getItem('userLanguage');
          
          // Check if profileLang exists in availableLangs, otherwise fallback to en-GB
          const validProfileLang = profileLang && availableLangs.includes(profileLang) ? profileLang : null;
          
          // Check if storageLang exists in availableLangs
          const validStorageLang = storageLang && availableLangs.includes(storageLang) ? storageLang : null;
          
          // Priority: Valid token language > valid localStorage > default
          const lang = validProfileLang ?? validStorageLang ?? defaultLang;
          translocoService.setActiveLang(lang);
          // Update localStorage to match the resolved valid language
          localStorage.setItem('userLanguage', lang);
          await firstValueFrom(translocoService.load(lang));
        } catch {
          // Fallback when user is not authenticated
          const storageLang = localStorage.getItem('userLanguage');
          // Ensure storageLang is valid
          const validStorageLang = storageLang && availableLangs.includes(storageLang) ? storageLang : null;
          const lang = validStorageLang ?? defaultLang;
          translocoService.setActiveLang(lang);
          localStorage.setItem('userLanguage', lang);
          await firstValueFrom(translocoService.load(lang));
        }
      };
    },
    multi: true,
  },
];
