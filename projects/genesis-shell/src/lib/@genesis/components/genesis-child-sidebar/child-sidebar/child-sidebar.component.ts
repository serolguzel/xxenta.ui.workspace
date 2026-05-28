import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GenesisVerticalNavigationComponent } from '../../navigation/vertical/vertical.component';
import { MatIconModule } from '@angular/material/icon';
import { GenesisNavigationItem } from '../../navigation/navigation.types';
import { NgIf } from '@angular/common';

@Component({
  selector: 'child-sidebar',
  templateUrl: './child-sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    NgIf,
    MatProgressBarModule,
    MatIconModule,
    GenesisVerticalNavigationComponent
  ]
})
export class ChildSidebarComponent {
  @Input() MenuData: GenesisNavigationItem[] = [];
  @Input() SidebarTitle: string = '';
  @Input() ShowSidebarTitle: boolean = false;
}
