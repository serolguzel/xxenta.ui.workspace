import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { APP_CONFIG_GEN, AuthService, IAppConfig } from 'genesis-coreservice';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule
  ]
})
export class LoginComponent implements OnInit {
  clock: string = '';
  logo: string = this.appConfig.authPageLogo || '';
  constructor(
    @Inject(APP_CONFIG_GEN) public appConfig: IAppConfig,
    private authService: AuthService) {

  }
  ngOnInit(): void {
    setTimeout(this.startTime, 1000);
  }

  login() {
    this.authService.startAuthentication();
  }

  startTime = () => {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    let m1 = this.checkTime(m);
    let s1 = this.checkTime(s);
    this.clock = h + ":" + m1 + ":" + s1;
  }
  checkTime = (i: number): string => {
    let result = '';
    if (i < 10) {
      result = `0${i}`
    } else {
      result = i.toString();
    }
    return result;
  }
}
