import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { GenesisConfig, GenesisConfigService } from '../../../../@genesis';

@Component({
    selector: 'theme-switch',
    templateUrl: './theme-switch.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'theme-switch',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatSlideToggleModule
    ]
})
export class ThemeSwitchComponent implements OnInit, OnDestroy {
    config?: GenesisConfig;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private readonly configService: GenesisConfigService
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

     setScheme(): void {
        let currentConfig = this.config?.scheme;
        if (currentConfig === 'light') {
            this.configService.config = { scheme: 'dark' };
        } else {
            this.configService.config = { scheme: 'light' };
        }
    }
}
