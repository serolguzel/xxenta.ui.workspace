import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation, input } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { genesisAnimations } from '../../../animations';
import { GenesisNavigationItem } from '../navigation.types';
import { GenesisNavigationService } from '../navigation.service';
import { GenesisUtilsService } from '../../../services/utils/utils.service';
import { GenesisHorizontalNavigationBasicItemComponent } from './components/basic/basic.component';
import { GenesisHorizontalNavigationBranchItemComponent } from './components/branch/branch.component';
import { GenesisHorizontalNavigationSpacerItemComponent } from './components/spacer/spacer.component';

@Component({
    selector       : 'genesis-horizontal-navigation',
    templateUrl    : './horizontal.component.html',
    styleUrls      : ['./horizontal.component.scss'],
    animations     : genesisAnimations,
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'genesisHorizontalNavigation',
    standalone     : true,
    imports        : [NgFor, NgIf, 
        GenesisHorizontalNavigationBasicItemComponent, 
        GenesisHorizontalNavigationBranchItemComponent,
        GenesisHorizontalNavigationSpacerItemComponent],
})
export class GenesisHorizontalNavigationComponent implements OnChanges, OnInit, OnDestroy
{
    @Input() name: string = '';
    readonly navigation = input<GenesisNavigationItem[]>();

    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private genesisNavigationService: GenesisNavigationService,
        private genesisUtilsService: GenesisUtilsService,
    )
    {
        this.name = this.genesisUtilsService.randomId();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void
    {
        // Navigation
        if ( 'navigation' in changes )
        {
            // Mark for check
            this.changeDetectorRef.markForCheck();
        }
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Make sure the name input is not an empty string
        if ( this.name === '' )
        {
            this.name = this.genesisUtilsService.randomId();
        }

        // Register the navigation component
        this.genesisNavigationService.registerComponent(this.name, this);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Deregister the navigation component from the registry
        this.genesisNavigationService.deregisterComponent(this.name);

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Refresh the component to apply the changes
     */
    refresh(): void
    {
        // Mark for check
        this.changeDetectorRef.markForCheck();

        // Execute the observable
        this.onRefreshed.next(true);
    }

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
