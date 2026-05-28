import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {GenesisConfigService} from 'genesis-shell';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
    imports: [
     
    ],
    providers: [

    ]
})
export class DashboardComponent implements OnInit {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private configService: GenesisConfigService
    ) {

    }
    ngOnInit(): void {
    }

    onItemClick = (e: any, data: any) => {
        switch (e.itemData.value) {
            case 1:
                this.router.navigate([`detail/${data.key}`], { relativeTo: this.activatedRoute });
                break;
            case 2:
                this.router.navigate([`/transfer/reservations/flight-reservations/flight-booking/${data.data.voucher}`], { relativeTo: this.activatedRoute });
                break;
        }
    }
    switchTheme () {
        this.configService.config = 'dark';
    }

    onReservationClick = () => {

    };

    onTransferPlanClick = () => {

    };

    onGuestTrafficPlanClick = () => {

    };

    goToReservationClick = (value: string) => {

    };
}
