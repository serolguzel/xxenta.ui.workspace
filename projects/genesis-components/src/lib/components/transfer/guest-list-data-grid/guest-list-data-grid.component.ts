import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import {
    DxiColumnModule,
    DxiItemModule,
    DxiValidationRuleModule,
    DxoEditingModule,
    DxoFormModule,
    DxoLabelModule,
    DxoPagerModule,
    DxoPagingModule,
    DxoPopupModule,
    DxoToolbarModule,
} from 'devextreme-angular/ui/nested';
import { Static } from 'genesis-coreservice';
import { LookupService } from '../../../services/lookup.service';
import { ReservationGuestBaseModel } from '../../../modules/reservation-management/transfer-reservations';

@Component({
    selector: 'guest-list-data-grid',
    standalone: true,
    imports: [
        CommonModule,
        DxDataGridModule,
        DxTemplateModule,
        DxiColumnModule,
        DxiItemModule,
        DxiValidationRuleModule,
        DxoEditingModule,
        DxoFormModule,
        DxoLabelModule,
        DxoPagerModule,
        DxoPagingModule,
        DxoPopupModule,
        DxoToolbarModule,
        TranslocoModule,
    ],
    templateUrl: './guest-list-data-grid.component.html',
    styles: ['.redOutline{outline:red solid 1px;}'],
    providers: [LookupService]
})
export class GuestListDataGridComponent {
    @Input() guests: ReservationGuestBaseModel[] = [];
    @Input() hasError: boolean;

    @Output() onRowInserted: EventEmitter<unknown>;
    @Output() onRowInserting: EventEmitter<unknown>;
    @Output() onRowRemoved: EventEmitter<unknown>;
    @Output() onRowRemoving: EventEmitter<unknown>;
    @Output() onRowUpdating: EventEmitter<unknown>;
    @Output() onRowUpdated: EventEmitter<unknown>;

    guestTitles = Static.guestTitles;
    guestTypes = Static.guestTypes;
    getDisplayExprCode: (item: any) => string;
    constructor(
        public lookupService: LookupService,
        private readonly translocoService: TranslocoService
    ) {
        this.onRowInserted = new EventEmitter<unknown>();
        this.onRowInserting = new EventEmitter<unknown>();
        this.onRowRemoved = new EventEmitter<unknown>();
        this.onRowRemoving = new EventEmitter<unknown>();
        this.onRowUpdating = new EventEmitter<unknown>();
        this.onRowUpdated = new EventEmitter<unknown>();
        this.getDisplayExprCode = (item: any) => {
            if (item == null) return '';
            const key = `labels.${item.code.toLowerCase()}`;
            return this.translocoService.translate(key);
        };
    }

    rowInserted(e: any) {
        this.onRowInserted.emit(e);
    }
    rowInserting(e: any) {
        this.onRowInserting.emit(e);
    }
    rowRemoved(e: any) {
        this.onRowRemoved.emit(e);
    }
    rowRemoving(e: any) {
        this.onRowRemoving.emit(e);
    }
    rowUpdating(e: any) {
        this.onRowUpdating.emit(e);
    }
    rowUpdated(e: any) {
        this.onRowUpdated.emit(e);
    }
}
