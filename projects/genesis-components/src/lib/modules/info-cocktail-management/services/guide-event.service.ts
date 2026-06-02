import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuideEventService {
  private reloadEvent: ReplaySubject<any> = new ReplaySubject<any>(1);
  get getReloadEvent$(): Observable<any> {
    return this.reloadEvent.asObservable();
  }

  set setReloadEvent$(value: any) {
    this.reloadEvent.next(value);
  }

}
