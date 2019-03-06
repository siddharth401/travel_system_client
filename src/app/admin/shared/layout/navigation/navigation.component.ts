import {Component, OnInit} from '@angular/core';
import { AppService } from "../../../../shared/app.service";
import { Router } from "@angular/router";
import {LoginInfoComponent} from "../../user/login-info/login-info.component";


@Component({

  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
  private language;
  private city_str;

  constructor(
      private app: AppService,
      private router: Router
  ) {
  }

  ngOnInit() {
    this.language = this.app.curLang;
    this.city_str = 'City';
  }
  
  logout() {
    let confirmation = confirm(this.app.trans("Are you sure you want to log out?"));
    if(confirmation == true) {
      this.router.navigate(['admin/auth/logout']);
    }
  }

}
