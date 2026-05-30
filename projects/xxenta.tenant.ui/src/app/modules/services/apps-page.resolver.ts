import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ParamsEventService } from "./params-event.service";

export const initialAppPageResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const eventService = inject(ParamsEventService);
    const id = route.paramMap.get('appId');
    eventService.setAppIdChange$ = id;
    return id;
}
  