import { Component, OnInit } from '@angular/core';
import { AppService } from "../../shared/app.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-logout',
  template:''
})
export class LogoutComponent implements OnInit
{
  constructor
  (
    private app: AppService,
    private router: Router
  ) {}

  ngOnInit()
  {
    this.app.get('users/logout').then(res =>
    {
      if(res.status == 200)
      {
        this.app.delConfig('AUTH_TOKEN');
        this.app.delConfig('CURRENT_USER');
        this.router.navigate(['admin/auth/login']);
      }
    });
  }
}
