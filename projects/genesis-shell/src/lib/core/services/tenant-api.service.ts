import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { GenesisNavigationItem } from '../../@genesis/components';
import { AppsService } from '../../layout/layouts';
import { NavigationService } from '../navigation/navigation.service';
import { Navigation } from '../navigation/navigation.types';
import { API_CONFIG_GEN, ApiClientConfig, AuthService, Constants } from 'genesis-coreservice';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TenantApiService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private appsService: AppsService,
    private navigationService: NavigationService,
    @Inject(API_CONFIG_GEN) public config: ApiClientConfig
  ) {

  }

  getNavigations(appCode: string): Observable<GenesisNavigationItem[]> {
    if (appCode === 'DRIVER') {
      const mockData: GenesisNavigationItem[] = [
        {
          id: '1',
          title: 'Driver Dashboard',
          type: 'basic',
          link: '/driver/dashboard',
          icon: 'dashboard',
        },
        {
          id: '2',
          title: 'Driver Profile',
          type: 'basic',
          link: '/driver/profile',
          icon: 'person',
        },
      ];
      return new Observable<GenesisNavigationItem[]>((observer) => {
        observer.next(mockData);
        observer.complete();
      }).pipe(
        tap((items: GenesisNavigationItem[]) => {
          this.navigationService.navigation$ = <Navigation>{
            default: items,
          };
        }),
      );
    } else {
      let ty = localStorage.getItem(Constants.ThemeTypeKey);
      let themeType = ty ? JSON.parse(ty) : null;
      let path = `Navigation/GetNavigationsByAppCode/${appCode}`;
      if (themeType)
        path = `${path}?themeType=${themeType}`;
      
      return this.getCallObservable(path).pipe(
        tap((items: GenesisNavigationItem[]) => {
          this.navigationService.navigation$ = <Navigation>{
            default: items,
          };
        }),
      );
    }
  }

  getAppsByUser(): Observable<any> {
    return this.getCallObservable('UserApps').pipe(
      tap((apps) => {
        this.appsService.apps$ = apps;
      }),
      catchError((error) => {
        const emptyApps: any = [];
        this.appsService.apps$ = emptyApps;
        return of(emptyApps);
      })
    );
  }

  getCallObservable(message: string, params?: Object): Observable<any> {
    let accessToken = this.authService.accessToken;
    let options: any = {
      responseType: 'json',
      headers: { Authorization: `Bearer ${accessToken}` }
    };
    if (params) {
      const request = this.toHttpParams(params);
      options['params'] = request;
    }
    let urlMessage = `${this.config.apiHost}/${message}`;
    return this.httpClient.get(urlMessage, options);
  }

  private toHttpParams(params: any): HttpParams {
    return Object.getOwnPropertyNames(params)
      .filter((x) => params[x] !== undefined)
      .reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }
}
