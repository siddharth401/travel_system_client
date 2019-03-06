import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { AppService } from "../../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';
import {UploadService} from "../../shared/upload/upload.service";
import { FormData } from '../../shared/form-data';
@Component({
  selector: 'admin-language-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {


  private isID = 0;
  private fb;
  private isDisplay = 0;
  private isSupport = 0;
  private current_page;
  private data =
      {
        id: '',
        name: '',
        display_name: '',
        prefix: '',
        icon: '',
        is_display:'',
        is_support:'',
        active: 1
      };
  private image_detail;
  constructor
  (
      private app: AppService,
      private route: ActivatedRoute,
      private router: Router,
      private upload: UploadService
  ) {}

  ngOnInit()
  {
    if(this.app.getConfig('admin_language_page')){
      this.current_page = this.app.getConfig('admin_language_page');
    }
    this.fb = new FormData(this.app,this.data);
    this.route.params.subscribe((params) =>
    {
      if (params['id'])
      {
        this.isID = 1;
        this.fb.isNew = false;
        this.fb.bindData('languages/detail',{id:params['id']});
        this.app.get('languages/detail', {id:params['id']}).then(res => {
          if (res.status == 200) {
            this.image_detail = res.json().data.icon;
          }
        });
      }
    });

  }

  save(confirm?:false)
  {
    if (this.fb.isNew == true && typeof $('input#icon')[0].files[0] == 'undefined') {
      this.fb.form.value['icon'] = 0;
    } else {
      if ($('.imagebox').length == 1 && typeof $('input#icon')[0].files[0] == 'undefined') {
        this.fb.form.value['icon'] = 2;
      } else {
        this.fb.form.value['icon'] = this.upload.getDataFile('icon');
      }
    }
    // show type language
    var checkedDisplay = $('#is-display').is(":checked");
    var checkedSupport = $('#is-support').is(":checked");
    if(checkedDisplay == true){
      this.isDisplay = this.app.constant.ActiveDefine.YES;
      this.fb.form.value['is_display'] = this.app.constant.ActiveDefine.YES;
    }else {
      this.isDisplay = this.app.constant.ActiveDefine.NO;
      this.fb.form.value['is_display'] = this.app.constant.ActiveDefine.NO;
    }
    if(checkedSupport == true){
      this.isSupport = this.app.constant.ActiveDefine.YES;
      this.fb.form.value['is_support'] = this.app.constant.ActiveDefine.YES;
    }else {
      this.isSupport = this.app.constant.ActiveDefine.NO;
      this.fb.form.value['is_support'] = this.app.constant.ActiveDefine.NO;
    }
    //show-image
    if ($('input#icon')[0].files[0]) {
      $('#show-icon').html("");
      this.getImageSource('icon', $('input#icon')[0].files[0], function (data) {
        $('#show-icon').append("<img src='" + data + "' width='150'>");
      });
    }else if(this.image_detail){
      $('#show-icon').html("");
      $('#show-icon').append("<img src='" + this.app.constant.FILE_URL+ this.image_detail + "' width='150'>");
    }


    this.fb.form.value['form_confirm'] = confirm;
    this.app.post('languages/save', this.fb.form.value).then(res =>
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
          this.backToList();
        }
      }
    });
  }
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
      $('.confirm_' + field).attr('src', fileSource);
      callback(fileSource);
    }
  }
  backToList(){
    if(this.app.getConfig('admin_language_page')){
      this.router.navigateByUrl('/admin/language;page='+this.current_page);
    }else {
      this.router.navigateByUrl('/admin/language');
    }
  }
}
