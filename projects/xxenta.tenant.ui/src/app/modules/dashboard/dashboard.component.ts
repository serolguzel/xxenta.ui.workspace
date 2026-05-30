import { Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
    DxFormComponent,
    DxFormModule,
    DxToolbarModule,
} from 'devextreme-angular';
import { AUTH_CONFIG_GEN, IAuthConfig } from 'genesis-coreservice';
import { SendNotificationToAllClients } from '../services/models/tenant.models';
import { TenantService } from '../services/tenant.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

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
export class DashboardComponent {
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

    constructor(
        private tenantService: TenantService,
        private translocoService: TranslocoService,
        @Inject(AUTH_CONFIG_GEN) public authConfig: IAuthConfig,
    ) { }

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
}
