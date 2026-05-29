import { Component, Inject, OnInit } from '@angular/core';
import { APP_CONFIG_GEN, AuthService, IAppConfig } from 'genesis-coreservice';


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
  standalone: true
})
export class CallbackComponent implements OnInit {
  logo: string = this.appConfig.authPageLogo || '';
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(APP_CONFIG_GEN) public appConfig: IAppConfig) { }

  async ngOnInit(): Promise<void> {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('code') || !params.has('state')) {
      this.authService.login();
      return;
    }

    try {
      await this.authService.finishLogin();
      window.location.assign(`${window.location.origin}/${this.appConfig.defaultRoute}`);
    } catch(error) {
      console.error('Error handling authentication callback:', error);
      this.authService.login();
    }
  }
}
