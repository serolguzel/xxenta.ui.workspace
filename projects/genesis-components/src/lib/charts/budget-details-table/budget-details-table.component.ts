import { Component } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {MatTableModule} from "@angular/material/table";

@Component({
  selector: 'app-budget-details-table',
  templateUrl: './budget-details-table.component.html',
  styleUrls: ['./budget-details-table.component.scss'],
  standalone: true,
  imports: [MatTableModule, NgClass, NgIf]
})
export class BudgetDetailsTableComponent {
    data = {
        columns: ['type', 'total', 'expensesAmount', 'expensesPercentage', 'remainingAmount', 'remainingPercentage'],
        rows   : [
            {
                id                 : 1,
                type               : 'Personel',
                total              : 14880,
                expensesAmount     : 14000,
                expensesPercentage : 94.08,
                remainingAmount    : 880,
                remainingPercentage: 5.92,
            },
            {
                id                 : 2,
                type               : 'Akaryakit',
                total              : 21080,
                expensesAmount     : 17240.34,
                expensesPercentage : 81.78,
                remainingAmount    : 3839.66,
                remainingPercentage: 18.22,
            },
            {
                id                 : 3,
                type               : 'Ofis Giderleri',
                total              : 34720,
                expensesAmount     : 3518,
                expensesPercentage : 10.13,
                remainingAmount    : 31202,
                remainingPercentage: 89.87,
            },
            {
                id                 : 4,
                type               : 'Pazarlama',
                total              : 18600,
                expensesAmount     : 0,
                expensesPercentage : 0,
                remainingAmount    : 18600,
                remainingPercentage: 100,
            },
            {
                id                 : 5,
                type               : 'Ek hizmetler',
                total              : 34720,
                expensesAmount     : 19859.84,
                expensesPercentage : 57.2,
                remainingAmount    : 14860.16,
                remainingPercentage: 42.8,
            },
        ],
    };
}
