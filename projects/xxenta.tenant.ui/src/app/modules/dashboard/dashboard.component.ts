import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
    DxFormComponent,
    DxFormModule,
    DxToolbarModule,
} from 'devextreme-angular';
import themes from 'devextreme/ui/themes';
import { AUTH_CONFIG_GEN, IAuthConfig } from 'genesis-coreservice';
import { SendNotificationToAllClients } from '../services/models/tenant.models';
import { TenantService } from '../services/tenant.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { GenesisConfig, GenesisConfigService } from 'genesis-shell';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        DxFormModule,
        DxToolbarModule,
        TranslocoModule,
    ],
    providers: [TenantService],
})
export class DashboardComponent implements OnInit, OnDestroy {
    @ViewChild(DxFormComponent, { static: false }) form?: DxFormComponent;
    model: SendNotificationToAllClients = <SendNotificationToAllClients>{
        text: '',
    };
    btnSave = {
        icon: 'save',
        text: this.translocoService.translate('labels.save'),
        type: 'default',
        onClick: this.send.bind(this),
    };
    btnPushToAccounting = {
        icon: 'pulldown',
        text: this.translocoService.translate('labels.push-to-accounting'),
        onClick: this.pushToAccounting.bind(this)
    };

    btnPushCustomerToAccounting = {
        icon: 'pulldown',
        text: this.translocoService.translate('labels.customer-push-to-accounting'),
        onClick: this.pushCustomersToAccounting.bind(this)
    };

    btnGenerateSubscrtion = {
        icon: 'coffee',
        text: this.translocoService.translate('labels.generate-subscription'),
        onClick: this.generateSubscription.bind(this)
    };
    private unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private tenantService: TenantService,
        private translocoService: TranslocoService,
        private readonly configService: GenesisConfigService,
        @Inject(AUTH_CONFIG_GEN) public authConfig: IAuthConfig,
    ) { }

    ngOnInit(): void {
        this.configService.config$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config: GenesisConfig) => {
                let scheme = config.scheme;
                this.onValueChanged(scheme === 'light' ? 'light' : scheme === 'dark' ? 'dark' : 'custom');
            });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    send() {
        var valid = this.form?.instance.validate().isValid;
        if (valid) {
            this.tenantService.SendNotificationToAllClients(this.model);
        }
    }

    pushToAccounting() {
        this.tenantService.PricePushToAccountingProcess();
    }

    pushCustomersToAccounting() {
        this.tenantService.CustomerPushToAccountingProcess();
    }

    generateSubscription() {
        this.tenantService.AddPaymentProcess();
    }

    onValueChanged(scheme: string) {
        const themeMap: Record<string, string> = {
            light: 'generic.light',
            dark: 'generic.dark',
            custom: 'generic.contrast',
        };
        themes.current(themeMap[scheme] ?? 'generic.light');
    };
}
