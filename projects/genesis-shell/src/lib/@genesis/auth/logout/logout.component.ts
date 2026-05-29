import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { APP_CONFIG_GEN, AuthService, IAppConfig } from 'genesis-coreservice';
import { interval } from 'rxjs';
import { genesisAnimations } from '../../animations';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  standalone: true,
  animations: genesisAnimations,
  imports: [
    MatButtonModule
]
})
export class LogoutComponent implements OnInit {
  clock: string = '';
  logo: string = this.appConfig.authPageLogo || '';
  constructor(
    @Inject(APP_CONFIG_GEN) public appConfig: IAppConfig,
    private authService: AuthService) {

  }

  ngOnInit(): void {
    interval(1000)
    .subscribe(() => {
      this.startTime();
    });
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
