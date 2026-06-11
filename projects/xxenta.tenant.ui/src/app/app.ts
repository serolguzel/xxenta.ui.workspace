import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthServiceModule, CoreServiceModule } from 'genesis-coreservice';
import { ServiceModule } from 'genesis-shell';
import { configureDevExtremeLicense } from '../shared/devextreme.config';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    RouterOutlet,
    ServiceModule,
    AuthServiceModule,
    CoreServiceModule
  ]
})
export class App {
  protected readonly title = signal('xxenta.tenant.ui');
  constructor() {   
    configureDevExtremeLicense();
  }
}
