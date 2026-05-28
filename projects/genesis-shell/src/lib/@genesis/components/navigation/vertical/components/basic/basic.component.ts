import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { GenesisUtilsService } from '../../../../../services/utils/utils.service';
import { GenesisNavigationService } from '../../../navigation.service';
import { GenesisNavigationItem } from '../../../navigation.types';
import { GenesisVerticalNavigationComponent } from '../../vertical.component';

@Component({
  selector: 'genesis-vertical-navigation-basic-item',
  templateUrl: './basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [
    NgClass, 
    NgIf, 
    RouterLink, 
    RouterLinkActive, 
    MatTooltipModule, 
    NgTemplateOutlet, 
    MatIconModule,
    TranslocoModule
  ],
})
export class GenesisVerticalNavigationBasicItemComponent implements OnInit, OnDestroy {
  @Input() item: GenesisNavigationItem;
  @Input() name: string;

  isActiveMatchOptions: IsActiveMatchOptions;
  private _genesisVerticalNavigationComponent: GenesisVerticalNavigationComponent;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _genesisNavigationService: GenesisNavigationService,
    private _genesisUtilsService: GenesisUtilsService,
  ) {
    this.isActiveMatchOptions = this._genesisUtilsService.subsetMatchOptions;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.isActiveMatchOptions =
      this.item.isActiveMatchOptions ?? this.item.exactMatch
        ? this._genesisUtilsService.exactMatchOptions
        : this._genesisUtilsService.subsetMatchOptions;

    // Get the parent navigation component
    this._genesisVerticalNavigationComponent = this._genesisNavigationService.getComponent(this.name);

    // Mark for check
    this._changeDetectorRef.markForCheck();

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
