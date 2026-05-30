import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ParamsEventService } from "./params-event.service";

export const initialClientPageResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const eventService = inject(ParamsEventService);
    const id = route.paramMap.get('clientId');
    eventService.setClientIdChange$ = id;
    return id;
}
  