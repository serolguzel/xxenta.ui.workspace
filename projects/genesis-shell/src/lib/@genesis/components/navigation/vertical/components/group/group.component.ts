import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { GenesisNavigationService } from '../../../navigation.service';
import { GenesisNavigationItem } from '../../../navigation.types';
import { GenesisVerticalNavigationComponent } from '../../vertical.component';
import { GenesisVerticalNavigationBasicItemComponent } from '../basic/basic.component';
import { GenesisVerticalNavigationCollapsableItemComponent } from '../collapsable/collapsable.component';
import { GenesisVerticalNavigationDividerItemComponent } from '../divider/divider.component';
import { GenesisVerticalNavigationSpacerItemComponent } from '../spacer/spacer.component';

@Component({
    selector       : 'genesis-vertical-navigation-group-item',
    templateUrl    : './group.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [
        NgClass, 
        NgIf, 
        MatIconModule, 
        NgFor, 
        GenesisVerticalNavigationBasicItemComponent, 
        GenesisVerticalNavigationCollapsableItemComponent, 
        GenesisVerticalNavigationDividerItemComponent, 
        forwardRef(() => GenesisVerticalNavigationGroupItemComponent),
        GenesisVerticalNavigationSpacerItemComponent,
        TranslocoModule
    ]
})
export class GenesisVerticalNavigationGroupItemComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_autoCollapse: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() autoCollapse: boolean;
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
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the parent navigation component
        this._genesisVerticalNavigationComponent = this._genesisNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._genesisVerticalNavigationComponent.onRefreshed.pipe(
            takeUntil(this._unsubscribeAll),
        ).subscribe(() =>
        {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
