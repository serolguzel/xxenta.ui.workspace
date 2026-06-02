import { Injectable } from '@angular/core';
import { UserLookupModel } from 'genesis-coreservice';
import { Observable, ReplaySubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ParamsEventService {
  private userIdChange: ReplaySubject<string> = new ReplaySubject<string>(1);
  private userChange: ReplaySubject<UserLookupModel> = new ReplaySubject<UserLookupModel>(1);

  set setUserIdChange$(value: string) {
    this.userIdChange.next(value);
  }

  get getUserIdChange$(): Observable<string> {
    return this.userIdChange.asObservable();
  }

  set setUserChange$(value: UserLookupModel) {
    this.userChange.next(value);
  }

  get getUserChange$(): Observable<UserLookupModel> {
    return this.userChange.asObservable();
  }
}