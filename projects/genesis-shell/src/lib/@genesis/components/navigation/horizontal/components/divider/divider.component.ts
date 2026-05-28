import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenesisNavigationItem } from '../../../navigation.types';
import { GenesisHorizontalNavigationComponent } from '../../horizontal.component';
import { GenesisNavigationService } from '../../../navigation.service';

@Component({
    selector: 'genesis-horizontal-navigation-divider-item',
    templateUrl: './divider.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass],
})
export class GenesisHorizontalNavigationDividerItemComponent implements OnInit, OnDestroy {
    @Input() item: GenesisNavigationItem;
    @Input() name: string;

    private genesisHorizontalNavigationComponent: GenesisHorizontalNavigationComponent;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private genesisNavigationService: GenesisNavigationService,
    ) {
    }

    ngOnInit(): void {
        // Get the parent navigation component
        this.genesisHorizontalNavigationComponent = this.genesisNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this.genesisHorizontalNavigationComponent.onRefreshed.pipe(
            takeUntil(this.unsubscribeAll),
        ).subscribe(() => {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }
}
