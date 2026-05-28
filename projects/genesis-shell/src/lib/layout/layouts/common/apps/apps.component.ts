import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IApps } from './apps.types';
import { AppsService } from './apps.service';

@Component({
    selector: 'applications',
    templateUrl: './apps.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'applications',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        NgIf,
        MatTooltipModule,
        NgFor,
        NgTemplateOutlet,
        MatSlideToggleModule
    ]
})
export class ApplicationsComponent implements OnInit, OnDestroy {
    @ViewChild('appsOrigin') private _appsOrigin: MatButton;
    @ViewChild('appsPanel') private _appsPanel: TemplateRef<any>;

    apps: IApps[];
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _appsService: AppsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
    ) {
    }

    ngOnInit(): void {
        this._appsService.apps$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((apps: IApps[]) => {
                this.apps = apps;
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    openPanel(): void {
        if (!this._appsPanel || !this._appsOrigin) {
            return;
        }

        if (!this._overlayRef) {
            this._createOverlay();
        }
        this._overlayRef.attach(new TemplatePortal(this._appsPanel, this._viewContainerRef));
    }

    closePanel(): void {
        this._overlayRef.detach();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private _createOverlay(): void {
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'genesis-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._appsOrigin._elementRef.nativeElement)
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
        });

        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }
}
