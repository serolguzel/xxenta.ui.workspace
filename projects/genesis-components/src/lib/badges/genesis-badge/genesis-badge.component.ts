import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'genesis-badge',
  templateUrl: './genesis-badge.component.html',
  standalone: true,
  imports: [
    NgIf
  ]
})
export class GenesisBadgeComponent {
  @Input() badge: string = 'Not';
}
