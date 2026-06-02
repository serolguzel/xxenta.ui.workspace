import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'editable-textbox',
  templateUrl: './editable-textbox.component.html',
  styleUrls: ['./editable-textbox.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    TextFieldModule
  ]
})
export class EditableTextboxComponent implements OnInit {
  @Input() value: string = '';

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
