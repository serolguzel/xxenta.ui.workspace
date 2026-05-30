import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DxToolbarModule } from 'devextreme-angular';

@Component({
  selector: 'action-section',
  templateUrl: './action-section.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DxToolbarModule
]
})
export class ActionSectionComponent implements OnInit {
  @Output() onReservationClick: EventEmitter<any>;
  @Output() onTransferPlanClick: EventEmitter<any>;
  btnReservation = {
    icon: 'assets/icons/electronic-ticket_32.png',
    text: 'Tur Rezervasyon',
    onClick: this.reservationClick.bind(this)
  };

  btnBooking = {
    icon: 'save',
    text: 'Tur Sat',
    type: "default",
    onClick: ()=>{}
  };
  
  btnTourTransferPlan = {
    icon: 'assets/icons/bus_32.png',
    text: 'Transfer Planla',
    onClick: this.transferPlanClick.bind(this)
  };

  constructor(
    
  ) { 
    this.onReservationClick = new EventEmitter();
    this.onTransferPlanClick = new EventEmitter();
  }
  ngOnInit() {
    
  }

  reservationClick (){
    this.onReservationClick.emit();
  }

  transferPlanClick() {
    this.onTransferPlanClick.emit();
  }
}
