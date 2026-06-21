import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AUTH_CONFIG_GEN, AuthService, IAuthConfig, UserModel } from 'genesis-coreservice';
import { SendNotificationToAllClients } from '../services/models/tenant.models';
import { TenantService } from '../services/tenant.service';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [
        ReactiveFormsModule,
        TranslocoModule,
        ButtonModule,
        FloatLabelModule,
        TextareaModule,
    ],
    providers: [TenantService],
})
export class DashboardComponent implements OnInit, OnDestroy {
    private readonly fb = inject(FormBuilder);
    private readonly tenantService = inject(TenantService);
    private readonly authService = inject(AuthService);

    model: SendNotificationToAllClients = <SendNotificationToAllClients>{
        text: '',
    };
    form!: FormGroup;

    // Header action buttons were hidden in the original DevExtreme toolbar ([visible]="false").
    showActionButtons = false;

    private unsubscribeAll: Subject<any> = new Subject<any>();
    user: UserModel = <UserModel>{};

    constructor(
        @Inject(AUTH_CONFIG_GEN) public authConfig: IAuthConfig,
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group({
            text: [this.model.text ?? '', Validators.required],
        });

        this.authService.getProfile().then((res: UserModel) => {
            this.user = res;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    send() {
        this.form.markAllAsTouched();
        if (this.form.valid) {
            this.model = { ...this.model, ...this.form.getRawValue() };
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
