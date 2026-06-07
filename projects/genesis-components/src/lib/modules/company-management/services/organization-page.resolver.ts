import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { OrganizationEventService } from "./organization-event.service";

export const initialOrganizationResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const eventService = inject(OrganizationEventService);
    const organizationId = route.paramMap.get('organizationId');
    console.log('initialOrganizationResolver', organizationId);
    eventService.setOrganizationIdChange$ = organizationId!;
    return organizationId ?? '';
}
  