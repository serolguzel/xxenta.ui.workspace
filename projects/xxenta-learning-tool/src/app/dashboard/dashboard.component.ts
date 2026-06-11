import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [ButtonModule]
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
