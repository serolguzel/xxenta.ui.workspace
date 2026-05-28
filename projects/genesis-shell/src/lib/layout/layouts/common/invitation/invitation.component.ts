import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { InvitationService } from './invitation.service';
import { InvitationModel } from './invitation.types';
import { DxButtonModule, DxFormModule, DxTagBoxModule, DxToolbarModule } from 'devextreme-angular';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'invitation',
    templateUrl: './invitation.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'invitation',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule, 
        MatIconModule, 
        NgIf, 
        MatTooltipModule,
        FormsModule, 
        ReactiveFormsModule, 
        MatFormFieldModule, 
        MatInputModule, 
        MatSlideToggleModule,
        DxFormModule,
        DxTagBoxModule,
        DxButtonModule,
        DxToolbarModule,
        TranslocoModule
    ],
})
export class InvitationComponent implements OnInit, OnDestroy {
    @ViewChild('invitationOrigin') private _invitationOrigin: MatButton;
    @ViewChild('invitationPanel') private _invitationPanel: TemplateRef<any>;
    @Input() buttonText: string;
    @Input() title: string = 'Invitation';
    shortcutForm: UntypedFormGroup;
    model: InvitationModel;
    invitationToolbars: any[] = [{
        id: 'save',
        disabled: false,
        location: 'after',
        locateInMenu: '',
        widget: 'dxButton',
        options: {
          icon: 'save',
          text: 'Save',
          type: "default",
          onClick: this.save.bind(this)
        }
      }];

    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private invitationService: InvitationService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
    ) {
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    openPanel(): void {
        if (!this._invitationPanel || !this._invitationOrigin) {
            return;
        }
        if (!this._overlayRef) {
            this._createOverlay();
        }
        this._overlayRef.attach(new TemplatePortal(this._invitationPanel, this._viewContainerRef));
    }

    closePanel(): void {
        this._overlayRef.detach();
    }

    save(): void {
       this.invitationService.setInvitation$ = this.model;
    }
    
    
    private _createOverlay(): void {
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'genesis-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._invitationOrigin._elementRef.nativeElement)
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
