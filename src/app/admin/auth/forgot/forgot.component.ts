import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AppService} from '../../../shared/app.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
})
export class ForgotComponent implements OnInit {
  private params = {'email':''};

  constructor(private router: Router, private app:AppService) { }

  ngOnInit() {
  }

  submit(event){
    event.preventDefault();
    this.params['email'] = $('[name="email"]').val();
    this.app.post('users/resetPassword', this.params).then(res => {
      if (res.status == 200) {
        this.router.navigate(['/admin/auth/forgot-complete'])
      }
    });
  }
}
