import { Component, OnInit } from '@angular/core';
import { AppService } from "../../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';
import { constant } from "../../shared/constant";
import {UploadService} from "../../shared/upload/upload.service";
import { FormData } from '../../shared/form-data';




@Component({
  selector: 'admin-country-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {


  private isID = 0;
  private fb;
  private listLanguage = {};
  private languageError = [];
  private nameCountryError = [];
  private display_nameCountryError = [];
  private error = {};
  private dataLanguage =
      {
        name: '',
        language_id:'',
        display_name: ''
      };
  private data =
      {
        id: '',
        name: '',
        is_search: false,
        is_profile: false,
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
    window.scrollTo(0,0);
    this.fb = new FormData(this.app,this.data);
    this.fb.initChild('country_translates', this.dataLanguage);
    this.route.params.subscribe((params) =>
    {
      if (params['id'])
      {
        this.isID = 1;
        this.fb.isNew = false;
        this.fb.bindData('countries/detail',{id:params['id']});
      }else {
        this.fb.addItem('country_translates');
      }
    });
  this.getListLanguage();
  }

  /**
   * return list test type for search
   */

  save(confirm?:false)
  {
    //show type country
    if($('#is-search').is(":checked")){
      this.fb.form.value['is_search'] = this.app.constant.TRUE;
    } else {
      this.fb.form.value['is_search'] = this.app.constant.FALSE;
    }
    if($('#is-profile').is(":checked")){
      this.fb.form.value['is_profile'] = this.app.constant.TRUE;
    } else {
      this.fb.form.value['is_profile'] = this.app.constant.FALSE;
    }
    console.log(this.fb.form.value);
    this.fb.form.value['form_confirm'] = confirm;
    this.app.post('countries/save', this.fb.form.value).then(res =>
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
          this.router.navigate(['admin/country']);
        }
      }else
        {
        this.error = res.json();
        this.languageError = [];
        this.nameCountryError = [];
        this.display_nameCountryError = [];
        for (let i = 0; i < $('.language_id').length; i++) {
          this.languageError.push(res.json()['country_translates.' + i + '.language_id']);
        }
        for (let i = 0; i < $('.language_id').length; i++) {
          this.nameCountryError.push(res.json()['country_translates.' + i + '.name']);
        }
        for (let i = 0; i < $('.language_id').length; i++) {
          this.display_nameCountryError.push(res.json()['country_translates.' + i + '.display_name']);
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
