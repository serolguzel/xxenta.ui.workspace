import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { UserLookupModel } from 'genesis-coreservice';
import { OrganizationModel } from 'genesis-components';

@Injectable({
  providedIn: 'root'
})
export class ParamsEventService {

  private appIdChange: ReplaySubject<string> = new ReplaySubject<string>(1);
  private clientIdChange: ReplaySubject<string> = new ReplaySubject<string>(1);

  private userIdChange: ReplaySubject<string> = new ReplaySubject<string>(1);
  private customerChange: ReplaySubject<OrganizationModel> = new ReplaySubject<OrganizationModel>(1);
  private userChange: ReplaySubject<UserLookupModel> = new ReplaySubject<UserLookupModel>(1);

  
  set setAppIdChange$(value: string) {
    this.appIdChange.next(value);
  }

  get getAppIdChange$(): Observable<string> {
    return this.appIdChange.asObservable();
  }

  set setClientIdChange$(value: string) {
    this.clientIdChange.next(value);
  }

  get getClientIdChange$(): Observable<string> {
    return this.clientIdChange.asObservable();
  }

  set setUserIdChange$(value: string) {
    this.userIdChange.next(value);
  }

  get getUserIdChange$(): Observable<string> {
    return this.userIdChange.asObservable();
  }

  set setCustomerChange$(value: OrganizationModel) {
    this.customerChange.next(value);
  }

  get getCustomerChange$(): Observable<OrganizationModel> {
    return this.customerChange.asObservable();
  }

  set setUserChange$(value: UserLookupModel) {
    this.userChange.next(value);
  }

  get getUserChange$(): Observable<UserLookupModel> {
    return this.userChange.asObservable();
  }
}