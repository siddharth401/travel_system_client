import { Component, OnInit } from '@angular/core';
import { AppService } from "../../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';
import {UploadService} from "../../shared/upload/upload.service";
import { FormData } from '../../shared/form-data';
import {interval} from "rxjs/observable/interval";
import {AuthService, FacebookLoginProvider, GoogleLoginProvider} from "angular4-social-login";

@Component({
  selector: 'admin-member-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit
{
  private fb;
  private member_id;
  private language_id = this.app.getConfig('BACKEND_LANG_ID');
  private auth_token = this.app.getConfig('AUTH_TOKEN');
  private language_error = [];
  private categories_error = [];
  private prefecture_error = [];
  private data =
      {
        id: '',
        type:'',
        name:'',
        active:'1',
        gender:'1',
        phone:'',
        address:'',
        fb:'',
        mail_magazine_option:'1',
        password:'',
        country_id:'',
        prefecture_id:'',
        nick_name:'',
        approve_guide:'1',
        identify_image_0:'',
        identify_image_1:'',
        identify_image_2:'',
        identify_image_3:'',
        identify_image_4:'',
        identify_image_5:'',
        identify_image_6:'',
        identify_image_7:'',
        identify_image_8:'',
        identify_image_9:'',
        updated_at:'',
        email:'',
        avatar:'',
        introduce:'',
        introduce_plan:'',
        delete_fb:0,
        phone_code:''
      };
  private dataLanguage =
      {
        language_id:'',
        language_err:''
      };
    private dataPrefecture =
        {
            prefecture_id:''
        };
    private dataCategory =
        {
            category_id:''
        };
    private member_places =
        {
            country_id:'',
            city_id:'',
        };
  private listLanguage = {};
  private listCountries = {};
  private listPrefectures = {};
  private listPrefecturesByCountry = {};
  private listPrefectureAddress = {};
  private listCountry;
  private listCountryMemberPlaces;
  private listCategory = {};
  private listPre = {};
  private listPreFollowCountry = {};
  private listCities = [];
  private countryErr;
  private cityErr;
  private checkedPre;
  private msgError;
  private msgFb;
  private msgPhoneErr;
  private checkFacebook;
  private country_name;
  private show_phone_code;
  private show_phone;
  private showPlaces;
  private show_gender;
    private dataFb = {
        'form_confirm': true,
        'authToken' :''
    };

  constructor(
      private app: AppService,
      private route: ActivatedRoute,
      private router: Router,
      private upload:UploadService,
      private authService: AuthService
  ) {}

  ngOnInit()
  {
    window.scrollTo(0,0);
    this.fb = new FormData(this.app,this.data);
    this.fb.initChild('languages', this.dataLanguage);
    this.fb.initChild('prefectures', this.dataPrefecture);
    this.fb.initChild('categories', this.dataCategory);
    this.fb.initChild('member_places', this.member_places);
    this.route.params.subscribe((params) =>
    {
      if(params['id'])
      {
        this.member_id = params['id'];
        this.fb.isNew = false;
        this.fb.bindData('members/detail',{id:params['id']});
        this.app.get('members/detail', {id:params['id']}).then(res => {
              if (res.status == 200) {
                  this.checkFacebook = res.json().data.fb;
                  $('#phone').val(res.json().data.phone);
                  this.checkedPre = res.json().data.prefecture_id;
                  if(res.json().data.member_places.length > 0) {
                      for (let i = 0; i < res.json().data.member_places.length; i++) {
                          this.getListCity(res.json().data.member_places[i].country_id, i);
                      }
                  }
              }
        });
      }
      else
      {
        this.fb.addItem('languages');
        this.fb.addItem('prefectures');
        this.fb.addItem('categories');
        this.fb.addItem('member_places');
      }
    });
    this.getListLanguage();
    this.getListCategory();
    this.getListPre();
    this.getListCountry();
    this.getListCountryMemberPlaces();
  }

  getDetailMember(){
      this.route.params.subscribe((params) =>
      {
          if(params['id'])
          {
              this.member_id = params['id'];
              this.fb.isNew = false;
              this.fb.bindData('members/detail',{id:params['id']});
              this.fb.form.value.mail_magazine_option = parseInt(this.fb.form.value.mail_magazine_option);
          }
          else
          {
              this.fb.addItem('languages');
              this.fb.addItem('prefectures');
              this.fb.addItem('categories');
              this.fb.addItem('member_places');
          }
      });
  }

  save(confirm?:false)
  {
   let places = [];
   if($(".member_places_country_id").length > 0){
       for(let i = 0;  i < $(".member_places_country_id").length; i++ ){
           places.push({country_name:$(".country_places_name_"+i+" option:selected").text(),city_name:$(".city_places_name_"+i+" option:selected").text()})
       }
   }
    this.showPlaces = places;
   console.log(this.showPlaces);

    this.fb.form.value['phone'] =  $('#phone').val();
    this.show_phone =  $('#phone').val();
    this.show_phone_code = this.app.constant.CountryCallingCodes[this.fb.form.value['phone_code']];
    this.country_name = this.listCountry[this.fb.form.value['country_id']];
    this.fb.form.value['form_confirm'] = confirm;
    if (this.fb.form.value.type == 1){
        this.fb.form.value.member_places = '';
    }
    this.app.post('members/save', this.fb.form.value).then(res =>
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
          this.router.navigate(['admin/members']);
        }
      }else {
          this.msgPhoneErr = res.json().phone;
          this.countryErr = [];
          for (let i = 0; i < $('.member_places_country_id').length; i++) {
              this.countryErr.push(res.json()['member_places.' + i + '.country_id']);
          }
          this.cityErr = [];
          for (let i = 0; i < $('.member_places_city_id').length; i++) {
              this.cityErr.push(res.json()['member_places.' + i + '.city_id']);
          }
          this.language_error = [];
          for (let i = 0; i < $('.language-err').length; i++) {
              this.language_error.push(res.json()['languages.' + i + '.language_id']);
          }
          this.categories_error = [];
          for (let i = 0; i < $('.category-err').length; i++) {
              this.categories_error.push(res.json()['categories.' + i + '.category_id']);
          }
          this.prefecture_error = [];
          for (let i = 0; i < $('.prefecture-err').length; i++) {
              this.prefecture_error.push(res.json()['prefectures.' + i + '.prefecture_id']);
          }
      }
    });
  }

  //get list language
  getListLanguage()
  {
    this.app.get('languages',{'active':1,'is_support': 1}).then(res =>
    {
      if (res.status == 200) {
        this.listLanguage = this.app.arrToList(res.json().data, 'id','display_name');
      }
    });
  }

    //get list category
    getListCategory()
    {
        this.app.get('categories',{'active':1}).then(res =>
        {
            this.app.get('categories/listCategory').then(res => {
                if (res.status === 200) {
                    this.listCategory = this.app.arrToList(res.json().data, 'category_id', 'name');
                }
            });
        });
    }

  changeStatusApprove(id,valueColumnChange) {
      if(confirm(this.app.trans("Are you sure to change status?"))) {
          this.app.post('members/approval_guide', {
              member_id: id,
              language_id:this.language_id,
              valueColumnChange: valueColumnChange
          }).then(res => {
              if (res.status == 200) {
                  this.fb.form.value.approve_guide = parseInt(valueColumnChange);
              } else {
                  this.msgError = res.json();
                  alert(this.msgError.message);
              }
          });
      } else {
          //nothing
      }
  }

    changeStatusNonApprove(id,valueColumnChange) {
        if(confirm(this.app.trans("Are you sure to change status?"))) {
            this.app.post('members/cancel_guide', {
                member_id: id,
                language_id:this.language_id,
                valueColumnChange: valueColumnChange
            }).then(res => {
                if (res.status == 200) {
                    this.fb.form.value.approve_guide = parseInt(valueColumnChange);
                }
            });
        }else {
            //Nothing
        }
    }

    changeImage(){
        $('#file-browser').modal('toggle');
    }

    DeleteFb(){
        if(confirm(this.app.trans("Do you want to delete the facebook connection?"))) {
            this.app.post('members/remove_facebook', {
                'form_confirm': true,
                'id'          : this.fb.form.value.id
            }).then(res => {
                if (res.status == 200) {
                    alert(this.app.trans('Facebook connection has been deleted.'));
                    this.fb.form.value.fb = null;
                }
                else {
                    alert(this.app.trans('You can not remove Facebook until you set the member password in profile.'));
                    this.msgFb = res.json();
                }
            });
        }
    }
    //get list city follow prefecture or country
    getListCity(country_id = null,i = null){
        this.app.get('cities/backend_list_by_country',{'country_id': country_id}).then(res => {
            if (res.status == 200) {
                this.listCities[i] = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    //get list prefecture follow language
    getListPre(is_detail = null)
    {
        this.app.get('prefectures/backend_lists').then(res =>
        {
            if (res.status == 200) {
                this.fb.form.value['prefecture_id'] = is_detail != null ? this.fb.form.value['prefecture_id'] : '';
                this.listPre = this.app.arrToList(res.json().data, 'id','name');
            }
        });
    }

    //get list country for profile
    getListCountry(){
        this.app.get('countries/backend_lists', {'is_profile': this.app.constant.TRUE}).then(res =>
        {
            if (res.status == 200) {
                this.listCountry = this.app.arrToList(res.json().data, 'id','name');
            }
        });
    }
    //get list country for search data
    getListCountryMemberPlaces(){
        this.app.get('countries/backend_lists', {'is_search': this.app.constant.TRUE}).then(res =>
        {
            if (res.status == 200) {
                this.listCountryMemberPlaces = this.app.arrToList(res.json().data, 'id','name');
            }
        });
        
    }
}