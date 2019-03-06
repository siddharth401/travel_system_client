import { Component, OnInit } from '@angular/core';
import { AppService } from "../../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';
import {UploadService} from "../../shared/upload/upload.service";
import { FormData } from '../../shared/form-data';




@Component({
  selector: 'admin-city-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  private listCountry = {};
  private listPrefectures = {};
  private listLanguage = {};
  private listPre = {};

  private fb;
  private languageError = [];
  private nameCityError = [];
  private error = {};
  private language_id = this.app.getConfig('BACKEND_LANG_ID');
  private dataLanguage =
      {
        name: '',
        language_id:'',
      };
  private data =
      {
        id: '',
        country_id: '',
        prefecture_id: '',
        prefix: '',
        active: 1
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
    this.fb.initChild('city_translates', this.dataLanguage);
    this.route.params.subscribe((params) =>
    {
      if (params['id'])
      {
        this.fb.isNew = false;
        this.fb.bindData('cities/detail',{id:params['id']});
      }else
        {
        this.fb.addItem('city_translates');
      }
    });
    this.getListCountry();
    this.getListLanguage();
    this.getListPre();
  }

  /**
   * return list country
   */

  getListCountry()
  {
    this.app.get('countries/backend_lists').then(res =>
    {
      if (res.status === 200) {
        this.listCountry = this.app.arrToList(res.json().data, 'id','name');
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

  //get list language
  getListPre()
  {
    this.app.get('prefectures/backend_lists').then(res =>
    {
      if (res.status == 200) {
        this.listPre = this.app.arrToList(res.json().data, 'id','name');
      }
    });
  }

  save(confirm?:false)
  {
    //if country is different Japan, set prefecture is null
    if(this.fb.form.value['country_id'] != this.app.constant.COUNTRY_DEFAULT) {
      delete this.fb.form.value['prefecture_id'];
    }
    this.fb.form.value['form_confirm'] = confirm;
    console.log(this.fb.form.value);
    this.app.post('cities/save', this.fb.form.value).then(res =>
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
          this.router.navigate(['admin/city']);
        }
      }else
      {
        this.error = res.json();
        this.languageError = [];
        this.nameCityError = [];
        for (let i = 0; i < $('.language_id').length; i++) {
          this.languageError.push(res.json()['city_translates.' + i + '.language_id']);
        }
        for (let i = 0; i < $('.language_id').length; i++) {
          this.nameCityError.push(res.json()['city_translates.' + i + '.name']);
        }
      }
    });
  }

  //get list prefecture follow country
  getPrefecture(country_id = null){
      this.app.get('prefectures/backend_lists',{'language_id':this.language_id}).then(res => {
          if (res.status == 200) {
              this.fb.form.value.prefecture_id = '';
              this.listPrefectures = this.app.arrToList(res.json().data, 'id', 'name_translate');
          }
      });
  }
}
