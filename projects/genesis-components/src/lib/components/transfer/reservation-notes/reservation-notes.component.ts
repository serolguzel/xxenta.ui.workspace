import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ReservationNoteModel } from '../transfer-plan-notes/note.models';
import { CoreService } from 'genesis-coreservice';

@Component({
    selector: 'app-reservation-notes',
    templateUrl: './reservation-notes.component.html',
    styleUrls: ['./reservation-notes.component.scss'],
    standalone: true,
    imports: [NgForOf, NgIf, DatePipe, MatIconModule]
})
export class ReservationNotesComponent implements OnInit {
    @Input() bookingId: string;
    @Input() userId: string;
    notes: ReservationNoteModel[] = [];
    isSending: boolean = false;
    constructor(protected coreService: CoreService) { }

    ngOnInit() {
        this.coreService.getCall(`Reservation/Notes/${this.bookingId}`).then((res: ReservationNoteModel[])=> {
            this.notes = res;
        });
    }

    async sendNote(input: HTMLInputElement) {
        if (input.value.trim()) {
            this.isSending = true;
            const response = await this.SaveNoteToTransferReservation(this.bookingId, input.value);
            this.notes.push(response);
            input.value = '';
            this.isSending = false;
        }
    }

    SaveNoteToTransferReservation(bookingId: string, note: string): Promise<ReservationNoteModel> {
        return this.coreService.postCall(`Reservation/Notes/${bookingId}`, { note });
    }
}
