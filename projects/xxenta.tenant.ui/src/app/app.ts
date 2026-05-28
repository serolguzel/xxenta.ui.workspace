import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServiceModule } from 'genesis-shell';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    RouterOutlet,
    ServiceModule
  ]
})
export class App {
  protected readonly title = signal('xxenta.tenant.ui');
}
