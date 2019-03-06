import { Component, OnInit } from '@angular/core';
import { AppService } from "../../../shared/app.service";
import { FormData } from "../../../shared/form-data";

@Component({
  selector: 'sa-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit
{
  constructor(
    private app: AppService
  ) {}

  private fb;
  private data =
  {
    name:'',
    email:''
  };

  ngOnInit()
  {
    this.fb = new FormData(this.app,this.data);
    this.fb.bindData('users/profile');
  }

  save()
  {
    this.app.post('users/profile', this.fb.form.value).then(res =>
    {
      if(res.status == 200)
      {
        this.app.curUser = this.fb.form.value;
        this.app.setConfig('CURRENT_USER', JSON.stringify(this.app.curUser));
        this.app.adminFlashSuccess(this.app.trans('Profile has been updated'),true);
      }
    })
  }
}