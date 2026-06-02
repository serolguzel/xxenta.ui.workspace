import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'passenger-more-detail',
  templateUrl: './passenger-more-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule
  ]
})
export class PassengerMoreDetailComponent {
  @Input() data: any = {};
}
