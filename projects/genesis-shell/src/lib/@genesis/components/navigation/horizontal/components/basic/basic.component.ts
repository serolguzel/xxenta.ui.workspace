import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GenesisNavigationItem } from '../../../navigation.types';
import { GenesisHorizontalNavigationComponent } from '../../horizontal.component';
import { GenesisNavigationService } from '../../../navigation.service';
import { GenesisUtilsService } from '../../../../../services/utils/utils.service';

@Component({
    selector: 'genesis-horizontal-navigation-basic-item',
    templateUrl: './basic.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass, NgIf, RouterLink,
        RouterLinkActive, MatTooltipModule,
        NgTemplateOutlet,
        MatMenuModule,
        MatIconModule],
})
export class GenesisHorizontalNavigationBasicItemComponent implements OnInit, OnDestroy {
    @Input() item: GenesisNavigationItem;
    @Input() name: string;

    isActiveMatchOptions: IsActiveMatchOptions;
    private genesisHorizontalNavigationComponent: GenesisHorizontalNavigationComponent;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private genesisNavigationService: GenesisNavigationService,
        private genesisUtilsService: GenesisUtilsService,
    ) {
        this.isActiveMatchOptions = this.genesisUtilsService.subsetMatchOptions;
    }

    ngOnInit(): void {
        this.isActiveMatchOptions =
            this.item.isActiveMatchOptions ?? this.item.exactMatch
                ? this.genesisUtilsService.exactMatchOptions
                : this.genesisUtilsService.subsetMatchOptions;

        // Get the parent navigation component
        this.genesisHorizontalNavigationComponent = this.genesisNavigationService.getComponent(this.name);

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Subscribe to onRefreshed on the navigation component
        this.genesisHorizontalNavigationComponent.onRefreshed.pipe(
            takeUntil(this.unsubscribeAll),
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
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }
}
