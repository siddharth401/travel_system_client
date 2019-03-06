import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../shared/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormData } from '../../../shared/form-data';

@Component({
  selector: 'admin-test-type-form',
  templateUrl: './test-type-form.component.html'
})
export class TestTypeFormComponent implements OnInit
{
  private fb;
  private data =
  {
    id: '',
    name: '',
    active: 1
  };

  constructor
  (
    private app: AppService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit()
  {
    this.fb = new FormData(this.app, this.data);

    this.route.params.subscribe((params) =>
    {
      if (params['id'])
      {
        this.fb.isNew = false;
        this.fb.bindData('tmp_test_types/form',{id:params['id']});
      }
    });
  }

  save(confirm?:false)
  {
    this.fb.form.value['form_confirm'] = confirm;
    this.app.post('tmp_test_types/form', this.fb.form.value).then(res =>
    {
      if (res.status === 200)
      {
        if (confirm)
        {
          $('#formConfirm').modal('show');
        }
        else
        {
          $('#formConfirm').modal('hide');
          this.app.adminFlashSuccess(this.app.trans('Data has been saved'));
          this.router.navigate(['admin/tmp-test-type']);
        }
      }
    });
  }
}