import { Injectable } from '@angular/core';
import { IdNamePair } from 'genesis-coreservice';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationEventService {
  private organizationIdChange: ReplaySubject<string> = new ReplaySubject<string>(1);
  private organizationChange: ReplaySubject<IdNamePair> = new ReplaySubject<IdNamePair>(1);

  set setOrganizationIdChange$(value: string) {
    this.organizationIdChange.next(value);
  }

  get getOrganizationIdChange$(): Observable<string> {
    return this.organizationIdChange.asObservable();
  }

  set setOrganizationChange$(value: IdNamePair) {
    this.organizationChange.next(value);
  }

  get getOrganizationChange$(): Observable<IdNamePair> {
    return this.organizationChange.asObservable();
  }
}