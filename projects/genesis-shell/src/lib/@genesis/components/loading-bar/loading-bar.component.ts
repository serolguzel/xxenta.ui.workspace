import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GenesisLoadingService } from 'genesis-coreservice';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'genesis-loading-bar',
    templateUrl: './loading-bar.component.html',
    encapsulation: ViewEncapsulation.None,
    exportAs: 'genesisLoadingBar',
    standalone: true,
    imports: [NgIf, MatProgressBarModule],
})
export class GenesisLoadingBarComponent implements OnChanges, OnInit, OnDestroy {
    @Input() autoMode: boolean = true;
    mode?: 'determinate' | 'indeterminate';
    progress: number = 0;
    show: boolean = false;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private genesisLoadingService: GenesisLoadingService, private cdr: ChangeDetectorRef) {
    }
    
    ngOnChanges(changes: SimpleChanges): void {
        if ('autoMode' in changes) {
            this.genesisLoadingService.setAutoMode(coerceBooleanProperty(changes.autoMode.currentValue));
        }
    }

    ngOnInit(): void {
        this.genesisLoadingService.mode$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((value) => {
                this.mode = value;
            });

        this.genesisLoadingService.progress$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((value) => {
                this.progress = value;
            });

        this.genesisLoadingService.show$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((value) => {
                this.show = value;
                this.cdr.detectChanges();
            });

    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }
}
