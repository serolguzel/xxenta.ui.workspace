import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GenesisNavigationItem } from '../../../navigation.types';
import { GenesisHorizontalNavigationComponent } from '../../horizontal.component';
import { GenesisNavigationService } from '../../../navigation.service';

@Component({
    selector: 'genesis-horizontal-navigation-spacer-item',
    templateUrl: './spacer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass],
})
export class GenesisHorizontalNavigationSpacerItemComponent implements OnInit, OnDestroy {
    @Input() item: GenesisNavigationItem;
    @Input() name: string;

    private genesisHorizontalNavigationComponent: GenesisHorizontalNavigationComponent;
    private unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private genesisNavigationService: GenesisNavigationService,
    ) {
    }
    ngOnInit(): void {
        this.genesisHorizontalNavigationComponent = this.genesisNavigationService.getComponent(this.name);

        this.genesisHorizontalNavigationComponent.onRefreshed.pipe(
            takeUntil(this.unsubscribeAll),
        ).subscribe(() => {
            this._changeDetectorRef.markForCheck();
        });
    }
    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }
}
