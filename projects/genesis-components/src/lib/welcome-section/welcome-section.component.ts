import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { WelcomeSectionOptions } from './welcome-section.model';
import { NgFor, NgIf } from '@angular/common';
import { UserModel } from 'genesis-coreservice';

@Component({
  selector: 'welcome-section',
  templateUrl: './welcome-section.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ]
})
export class WelcomeSectionComponent implements OnInit {
  @Input() user: UserModel = <UserModel>{};
  @Input() options: WelcomeSectionOptions = <WelcomeSectionOptions>{
    actions: []
  };
  constructor(
    
  ) { }
  ngOnInit() {
    
  }
}
