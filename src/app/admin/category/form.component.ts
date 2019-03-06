import { Component, OnInit } from '@angular/core';
import { AppService } from "../../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';
import {UploadService} from "../../shared/upload/upload.service";
import { FormData } from '../../shared/form-data';
@Component({
  selector: 'admin-category-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit
{
  private isID = 0;
  private fb;
  private data_error = [];
  private data =
      {
        id: '',
        prefix: '',
        order: '',
        is_top: 1,
        icon:'',
        active: 1,
      };
  private dataLanguage =
      {
        name: '',
        language_id:'',
        name_err:'',
        lang_err:''
      };
  private listLanguage = {};

  constructor(
      private app: AppService,
      private route: ActivatedRoute,
      private router: Router,
      private upload:UploadService
  ) {}

  ngOnInit()
  {
    window.scrollTo(0,0);
    this.fb = new FormData(this.app,this.data);
    this.fb.initChild('category_translates', this.dataLanguage);

    this.route.params.subscribe((params) =>
    {
      if(params['id'])
      {
        this.isID = 1;
        this.fb.isNew = false;
        this.fb.bindData('categories/detail',{id:params['id']});
      }
      else
      {
        this.fb.addItem('category_translates');
      }
    });
    this.getListLanguage();
  }

  save(confirm?:false)
  {
    if( $('.imagebox').click().length == 0 && $('.confirm_icon').length == 0 && typeof $('input#icon')[0].files[0] == 'undefined'){
      this.fb.form.value['icon'] = {};
    }else {
      this.fb.form.value['icon'] = this.upload.getDataFile('icon');
      if($('img').length == 0){
        this.getImageSource('icon', $('input#icon')[0].files[0], function (data) {
          $('#show-icon').append("<img src='"+data+"' width='150'>")
        });
      }
    }
    this.fb.form.value['form_confirm'] = confirm;
    console.log(this.fb.form.value);
    this.app.post('categories/save', this.fb.form.value).then(res =>
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
          this.router.navigate(['admin/category']);
        }
      }
      else {
        this.data_error = res.json();
      }
    });
  }

  /**
   * Lifecycle hook that is called after every check of a component's view.
   */
  ngAfterViewChecked(){
    if($('.imagebox img').length == 0){
      $('#deleteIcon').hide();
      $('.imagebox').remove();
    }else {
      $('#deleteIcon').show();
    }
  }

  romoveIcon(){
    $('img').remove();
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

  //get image source
  getImageSource(field, file, callback) {
    if (file.type.indexOf('image') != -1) {

      let reader = new FileReader();
      reader.onload = function (e) {
        let result = e.target['result'];
        callback(result);
      };
      reader.readAsDataURL(file);
      return;
    } else {
      let fileSource = this.app.constant.BASE_WEB + 'default/file-default.png';
      $('.confirm_'+field).attr('src', fileSource);
      callback(fileSource);
    }
  }
}