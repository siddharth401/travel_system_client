import { Component, OnInit } from '@angular/core';
import { AppService } from "../../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';
import { FormData} from "../../shared/form-data";

@Component({
  selector: 'user-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit 
{
  private fb;
  private data =
  {
    id: '',
    username:'',
    password:'',
    email:'',
    name:'',
    group: null,
    active: 1,
  };

  constructor(
    private app: AppService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit()
  {
    this.fb = new FormData(this.app,this.data);

    this.route.params.subscribe((params) =>
    {
      if(params['id'])
      {
        this.fb.isNew = false;
        this.fb.bindData('users/form',{id:params['id']});
      }
    });
  }

  save(confirm?:false)
  {
    this.fb.form.value['form_confirm'] = confirm;

    this.app.post('users/form', this.fb.form.value, ['avatar']).then(res =>
    {
      if(res.status == 200)
      {
        if(confirm)
        {
          $('#formConfirm').modal('show');
        }
        else
        {
          $('#formConfirm').modal('hide');
          this.app.adminFlashSuccess('User has been saved');
          if(JSON.parse(this.app.getConfig('CURRENT_USER')).id == this.fb.form.get('id').value && this.fb.form.get('active').value == 0)
          {
            this.app.delConfig('AUTH_TOKEN');
            this.app.delConfig('CURRENT_USER');
            this.router.navigate(['admin/auth/login']);
          }
          else
          {
            this.router.navigate(['admin/user/']);
          }
        }
      }
    });
  }
}