import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

export const initialReservationPageResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const id = route.paramMap.get('contractId');
  
  return id ?? '';
}