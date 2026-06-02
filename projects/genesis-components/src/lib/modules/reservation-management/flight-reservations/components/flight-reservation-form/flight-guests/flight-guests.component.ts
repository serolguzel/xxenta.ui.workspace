import { Component, Input } from '@angular/core';
import { DxDataGridModule, DxTemplateModule } from "devextreme-angular";
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
    DxoToolbarModule
} from "devextreme-angular/ui/nested";
import { FlightGuestModel } from '../../../models/flight.models';
import { Static } from 'genesis-coreservice';
import { LookupService } from '../../../../../../services/lookup.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-flight-guests',
    templateUrl: './flight-guests.component.html',
    styles: ['.redOutline{outline:red solid 1px;}'],
    standalone: true,
    imports: [
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
        TranslocoModule
    ],
    providers: [LookupService]
})
export class FlightGuestsComponent {
    @Input() guests: FlightGuestModel[] = [];
    @Input() hasError: boolean;
    guestTitles = Static.guestTitles;
    guestTypes = Static.guestTypes;
    getDisplayExprCode: (item: any) => string;
    constructor(
        public lookupService: LookupService,
        private translocoService: TranslocoService
    ) {
        this.getDisplayExprCode = (item: any) => {
            if (item == null) return '';
            const key = `labels.${item.code.toLowerCase()}`;
            return this.translocoService.translate(key);
        };
    }
}
