import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'badge-taskstatus',
  templateUrl: './badge-taskstatus.component.html',
  standalone: true,
  imports: [
    NgClass
]
})
export class BadgeTaskStatusComponent {
  @Input() text?: string | null;
  @Input() color?: string = '';
  @Input() textSizeClass: string = 'text-xs ring-green-600/20';
}
