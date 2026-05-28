import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IApps } from './apps.types';

@Injectable({ providedIn: 'root' })
export class AppsService {
    private _apps: ReplaySubject<IApps[]> = new ReplaySubject<IApps[]>();

    get apps$(): Observable<IApps[]> {
        return this._apps.asObservable();
    }

    set apps$(value: IApps[]) {
        this._apps.next(value);
    }
}
