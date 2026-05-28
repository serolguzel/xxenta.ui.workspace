import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenesisNavigationItem } from '../../../navigation.types';
import { GenesisVerticalNavigationComponent } from '../../vertical.component';
import { GenesisNavigationService } from '../../../navigation.service';
import { NgClass } from '@angular/common';

@Component({
    selector: 'genesis-vertical-navigation-spacer-item',
    templateUrl: './spacer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [NgClass]
})
export class GenesisVerticalNavigationSpacerItemComponent implements OnInit, OnDestroy {
    @Input() item: GenesisNavigationItem;
    @Input() name: string;

    private _genesisVerticalNavigationComponent: GenesisVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _genesisNavigationService: GenesisNavigationService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the parent navigation component
        this._genesisVerticalNavigationComponent = this._genesisNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._genesisVerticalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll),
        ).subscribe(() => {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
