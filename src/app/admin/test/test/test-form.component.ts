import { Component, OnInit } from '@angular/core';
import { AppService} from '../../../shared/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormData } from '../../../shared/form-data';
import {UploadService} from "../../../shared/upload/upload.service";

@Component({
  selector: 'admin-test-form',
  templateUrl: './test-form.component.html'
})
export class TestFormComponent implements OnInit
{
  private listTestType;

  private fb;
  private data =
  {
    id: '',
    tmp_test_type_id: null,
    name: '',
    image: '',
    avatar: '',
    avatar2: '',
    description: '',
    content_en: '',
    active: 1
  };

  private dataTestItem =
    {
      id: '',
      name: '',
      number: '',
      active: '',
    };

  constructor
  (
    private app: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private upload: UploadService
  ) {}

  ngOnInit()
  {
    this.fb = new FormData(this.app,this.data);
    this.fb.initChild('tmp_test_items', this.dataTestItem);

    this.route.params.subscribe((params) =>
    {
      if (params['id'])
      {
        this.fb.isNew = false;
        this.fb.bindData('tmp_tests/form',{id:params['id']});
      }
    });

    this.getListTestType();
  }

  /**
   * return list test type for search
   */
  getListTestType()
  {
    this.app.get('tmp_test_types').then(res =>
    {
      if (res.status === 200) {
        this.listTestType = this.app.arrToList(res.json().data, 'id', 'name');
      }
    });
  }

  save(confirm?:false)
  {
    this.fb.form.value['form_confirm'] = confirm;
    this.fb.form.value['image'] = this.upload.getDataFile('test_field_image');

    this.app.post('tmp_tests/form', this.fb.form.value).then(res =>
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
          this.router.navigate(['admin/tmp-test']);
        }
      }
    });
  }
}