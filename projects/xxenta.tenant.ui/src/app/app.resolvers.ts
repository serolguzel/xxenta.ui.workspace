import { inject } from '@angular/core';
import { NotificationService } from 'genesis-apiservices';
import { CoreService } from 'genesis-coreservice';
import {
    NavigationService,
    TenantApiService,
} from 'genesis-shell';
import { forkJoin } from 'rxjs';

export const initialDataResolver = () => {
    const navigationService = inject(NavigationService);
    const core = inject(CoreService);
    const tenant = inject(TenantApiService);
    const notify = inject(NotificationService);
    return forkJoin([
        navigationService.get(),
        //core.setIpAddress(),
        tenant.getAppsByUser(),
        notify.getNotifications(),
    ]);
};
