import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { AppService } from "../app.service";

@Injectable()
export class AuthGuard implements CanActivateChild
{
  constructor
  (
    private app: AppService,
    private router: Router
  ) {}

  canActivateChild() {
    return this.checkAuth();
  }

  checkAuth()
  {
    let token = this.app.getConfig('AUTH_TOKEN', '');
    let user =  this.app.getConfig('CURRENT_USER','');

    if(token == '' || user == '')
    {
      this.router.navigate(['admin/auth/login']);
      return false;
    }

    /*this.app.get('users/check').then(res =>
    {
      if(res.status == 401)
      {
        this.router.navigate(['admin/auth/login']);
        return false;
      }
    });*/

    return true;
  }
}