import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { ReservationNoteModel } from './note.models';

@Component({
  selector: 'app-transfer-plan-notes',
  templateUrl: './transfer-plan-notes.component.html',
  styleUrls: ['./transfer-plan-notes.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslocoModule],
})
export class TransferPlanNotesComponent implements OnChanges {
  @Input({ required: true }) transferNotes: ReservationNoteModel[] = [];
  @Input() userId: string | null = null;

  groupedNotes: Array<{
    voucher: string;
    operatorVoucher: string | null;
    notes: ReservationNoteModel[];
  }> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transferNotes']?.currentValue) {
      this.groupNotesByVoucher();
    }
  }

  private groupNotesByVoucher(): void {
    const map = new Map<string, { operatorVoucher: string | null; notes: ReservationNoteModel[] }>();

    for (const note of this.transferNotes) {
      const key = note.voucher;
      if (!map.has(key)) {
        map.set(key, { operatorVoucher: note.operatorVoucher ?? null, notes: [] });
      }
      map.get(key)?.notes.push(note);
    }

    this.groupedNotes = [];
    for (const [voucher, data] of map.entries()) {
      this.groupedNotes.push({
        voucher,
        operatorVoucher: data.operatorVoucher,
        notes: data.notes
      });
    }

    this.groupedNotes.sort((a,b) => a.voucher.localeCompare(b.voucher));
  }
}

