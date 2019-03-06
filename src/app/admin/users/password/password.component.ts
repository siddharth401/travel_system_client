import { Component, OnInit } from '@angular/core';
import { AppService } from "../../../shared/app.service";
import { FormData } from "../../../shared/form-data";

@Component({
  selector: 'sa-change-password',
  templateUrl: './password.component.html',
})

export class PasswordComponent implements OnInit 
{
  constructor(private app: AppService) {}

  private fb;
  private data =
  {
    old_password: '',
    new_password: '',
    confirm_password: ''
  };

  ngOnInit()
  {
    this.fb = new FormData(this.app,this.data);
  }

  save()
  {
  	this.app.post('users/password',this.fb.form.value).then(res =>
    {
      if(res.status == 200)
      {
        this.app.adminFlashSuccess(this.app.trans(res.json().message),true);
        this.fb = new FormData(this.app,this.data);
      }
    });
  }
}