import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { CreateFlights } from "./flight-route-model";

@Injectable({
  providedIn: 'root'
})
export class FlightRouteEventService {
  private savedFlight: ReplaySubject<CreateFlights> = new ReplaySubject<CreateFlights>();

  set setSavedFlight$(value: CreateFlights) {
    this.savedFlight.next(value);
  }

  get getSavedFlight$(): Observable<CreateFlights> {
    return this.savedFlight.asObservable();
  }
}