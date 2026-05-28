import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from './navigation.types';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    constructor(private _httpClient: HttpClient) {
    }
    set navigation$(notification: Navigation) {
        this._navigation.next(notification);
    }

    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }
    get(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            }),
        );
    }
}
