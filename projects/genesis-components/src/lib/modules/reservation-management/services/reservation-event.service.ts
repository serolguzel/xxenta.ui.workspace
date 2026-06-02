import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationEventService {
  private pageTitleChange: ReplaySubject<string> = new ReplaySubject<string>(1);

  set pageTitleChange$(value: string) {
    this.pageTitleChange.next(value);
  }

  get pageTitleChange$(): Observable<string> {
    return this.pageTitleChange.asObservable();
  }
}