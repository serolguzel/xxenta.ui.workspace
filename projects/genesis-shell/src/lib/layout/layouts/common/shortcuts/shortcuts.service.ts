import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { Shortcut } from './shortcuts.types';

@Injectable({ providedIn: 'root' })
export class ShortcutsService {
    private _shortcuts: ReplaySubject<Shortcut[]> = new ReplaySubject<Shortcut[]>(1);
    constructor(private _httpClient: HttpClient) {
    }

    get shortcuts$(): Observable<Shortcut[]> {
        return this._shortcuts.asObservable();
    }

    getAll(): Observable<Shortcut[]> {
        return this._httpClient.get<Shortcut[]>('api/common/shortcuts').pipe(
            tap((shortcuts) => {
                this._shortcuts.next(shortcuts);
            }),
        );
    }

    create(shortcut: Shortcut): Observable<Shortcut> {
        return this.shortcuts$.pipe(
            take(1),
            switchMap(shortcuts => this._httpClient.post<Shortcut>('api/common/shortcuts', { shortcut }).pipe(
                map((newShortcut) => {
                    this._shortcuts.next([...shortcuts, newShortcut]);
                    return newShortcut;
                }),
            )),
        );
    }

    update(id: string, shortcut: Shortcut): Observable<Shortcut> {
        return this.shortcuts$.pipe(
            take(1),
            switchMap(shortcuts => this._httpClient.patch<Shortcut>('api/common/shortcuts', {
                id,
                shortcut,
            }).pipe(
                map((updatedShortcut: Shortcut) => {
                    const index = shortcuts.findIndex(item => item.id === id);
                    shortcuts[index] = updatedShortcut;
                    this._shortcuts.next(shortcuts);
                    return updatedShortcut;
                }),
            )),
        );
    }

    delete(id: string): Observable<boolean> {
        return this.shortcuts$.pipe(
            take(1),
            switchMap(shortcuts => this._httpClient.delete<boolean>('api/common/shortcuts', { params: { id } }).pipe(
                map((isDeleted: boolean) => {
                    const index = shortcuts.findIndex(item => item.id === id);
                    shortcuts.splice(index, 1);
                    this._shortcuts.next(shortcuts);
                    return isDeleted;
                }),
            )),
        );
    }
}
