import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { GenesisHorizontalNavigationBasicItemComponent } from '../basic/basic.component';
import { GenesisNavigationItem } from '../../../navigation.types';
import { GenesisHorizontalNavigationComponent } from '../../horizontal.component';
import { GenesisNavigationService } from '../../../navigation.service';
import { GenesisHorizontalNavigationDividerItemComponent } from '../divider/divider.component';

@Component({
    selector: 'genesis-horizontal-navigation-branch-item',
    templateUrl: './branch.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, NgClass, MatMenuModule, NgTemplateOutlet,
        NgFor,
        GenesisHorizontalNavigationBasicItemComponent,
        forwardRef(() => GenesisHorizontalNavigationBranchItemComponent),
        GenesisHorizontalNavigationDividerItemComponent,
        MatTooltipModule,
        MatIconModule],
})
export class GenesisHorizontalNavigationBranchItemComponent implements OnInit, OnDestroy {
    static ngAcceptInputType_child: BooleanInput;

    @Input() child: boolean = false;
    @Input() item: GenesisNavigationItem;
    @Input() name: string;
    @ViewChild('matMenu', { static: true }) matMenu: MatMenu;

    private genesisHorizontalNavigationComponent: GenesisHorizontalNavigationComponent;
    private unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private genesisNavigationService: GenesisNavigationService,
    ) {

    }
    ngOnInit(): void {
        this.genesisHorizontalNavigationComponent = this.genesisNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this.genesisHorizontalNavigationComponent.onRefreshed.pipe(
            takeUntil(this.unsubscribeAll),
        ).subscribe(() => {
            // Mark for check
            this.changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }
    triggerChangeDetection(): void {
        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
