import { Component, OnInit } from '@angular/core';
import { AppService } from "../../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';
import {UploadService} from "../../shared/upload/upload.service";
import { FormData } from '../../shared/form-data';




@Component({
  selector: 'admin-prefecture-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  private listCountry = {};
  private languageError = [];
  private namePreError = [];
  private display_namePreError = [];
  private listLanguage = {};
  private error = {};
  private fb;
  private language_id = this.app.getConfig('BACKEND_LANG_ID');
  private data =
      {
        id: '',
        // name: '',
        prefix: '',
        order: '',
        country_id: this.app.constant.COUNTRY_DEFAULT,
        active: 1
      };
  private dataLanguage =
      {
        name: '',
        language_id:'',
        display_name: ''
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
    this.fb.initChild('prefecture_translates', this.dataLanguage);
    this.route.params.subscribe((params) =>
    {
      if (params['id'])
      {
        this.fb.isNew = false;
        this.fb.bindData('prefectures/detail',{id:params['id']});

      }else {
        this.fb.addItem('prefecture_translates');
      }
    });
    this.getListCountry();
    this.getListLanguage();
  }

  /**
   * return list country
   */

  getListCountry()
  {
    this.app.get('countries/list_by_language',{'language_id':this.language_id}).then(res =>
    {
      if (res.status === 200) {
        this.listCountry = this.app.arrToList(res.json().data, 'id','name');
      }
    });
  }





  save(confirm?:false)
  {
    this.fb.form.value['form_confirm'] = confirm;
    this.app.post('prefectures/save', this.fb.form.value).then(res =>
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
          this.router.navigate(['admin/prefecture']);
        }
      } else
        {
        this.error = res.json();
        this.languageError = [];
        this.namePreError = [];
        this.display_namePreError = [];
        for (let i = 0; i < $('.language_id').length; i++) {
          this.languageError.push(this.app.trans(res.json()['prefecture_translates.' + i + '.language_id']));
        }
        for (let i = 0; i < $('.language_id').length; i++) {
          this.namePreError.push(this.app.trans(res.json()['prefecture_translates.' + i + '.name']));
        }
        for (let i = 0; i < $('.language_id').length; i++) {
          this.display_namePreError.push(this.app.trans(res.json()['prefecture_translates.' + i + '.display_name']));
        }
      }
    });
  }

  //get list language
  getListLanguage()
  {
    this.app.get('languages',{'active':1, 'is_display': 1}).then(res =>
    {
      if (res.status == 200) {
        this.listLanguage = this.app.arrToList(res.json().data, 'id','name');
      }
    });
  }
}
