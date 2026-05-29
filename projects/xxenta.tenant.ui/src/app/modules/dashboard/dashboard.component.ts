import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { GenesisConfig, GenesisConfigService, Scheme } from 'genesis-shell';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        RouterModule
    ],
    providers: [

    ]
})
export class DashboardComponent implements OnInit, OnDestroy {
    config?: GenesisConfig;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private configService: GenesisConfigService
    ) {

    }
    ngOnInit(): void {
        this.configService.config$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config: GenesisConfig) => {
                this.config = config;
            });
    }
    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    setScheme(scheme: Scheme): void {
        this.configService.config = { scheme };
    }
}

