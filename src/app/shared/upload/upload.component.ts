import {Component, OnInit, Input, Output} from '@angular/core';
import {AppService} from "../app.service";
import {UploadService} from "./upload.service";

@Component({
    selector: 'sa-file-upload',
    templateUrl: 'upload.component.html',
    styleUrls: [
        'upload.component.css'
    ]
})
export class UploadComponent implements OnInit 
{
    @Input() public fieldName:string;
    @Input() public front:string = '1';
    @Input() public filePath:string;
    @Input() public extensions:string;
    @Input() public size:number;
    @Input() public confirm:boolean;
    @Input() public required:string = 'false';
    @Output() public output:string = 'abc';
    public validateErrors:any;
    public fileConfirm:any;
    private curMember = this.app.getCurrentMember();

    constructor(
      private app:AppService,
      private uploadService: UploadService
    ) {}

    ngOnInit() {
    }

    changeInputFile(event)
    {
        this.validateErrors = [];
        let fileToUpload = this.app.filesUpload;
        let dataConfirm = [];
        let files = event.target.files;
        let thisComponent = this;
        let fileValidate = {
            required: this.required,
            size: this.size,
            extensions: this.extensions.split('|')
        };
        let validateErrors = this.validateFile(files, fileValidate);
        if (typeof validateErrors['type'] != 'undefined') {
            fileToUpload = false;
            this.validateErrors = validateErrors;
            $('.input_'+this.fieldName).val('');
            $('.confirm_'+this.fieldName).attr('src', this.app.constant.FILE_URL+this.filePath);
        } else {
            fileToUpload = files[0];
            this.getImageSource(this.fieldName, fileToUpload, function (data) {
              $('.confirm_'+thisComponent.fieldName).attr('src', data);
            });
        }
        this.uploadService.setDataFile(this.fieldName, fileToUpload);
        if (typeof validateErrors['type'] == 'undefined') {
            if(this.front == '2')
            {
                this.app.post('mypage/profile/upload_avatar', {avatar: fileToUpload}).then(res => {
                    if (res.status == 200) {
                        let data = res.json().data;
                        this.app.setConfig('CURRENT_MEMBER', JSON.stringify(data));
                        this.app.number_on_header.avatar = data.avatar;
                        $("#avatar_member img").attr('src', this.app.constant.FILE_URL + data.avatar)
                    } else {
                        alert('Error');
                    }
                });
            }
            if(this.front == '3')
            {
                this.app.post('mypage/profile/upload_banner', {banner: fileToUpload}).then(res => {
                    if (res.status == 200) {
                        let banner = res.json().data.banner;
                        $("#banner_member img").attr('src', this.app.constant.FILE_URL + banner);
                    }
                });
            }
        } else {
            let message = this.validateErrors;
            if (message.type == 'required' && (this.front == '2' || this.front == '3')) {
                return false;
            }
            alert(message.message);
        }
    }



    validateFile(files, validateRulesCustom:{})
    {
        let validateRules = {};
        Object.assign(validateRules, this.app.constant.fileValidateDefault, validateRulesCustom);
        let maxSize = validateRules['size'];
        let extensions = validateRules['extensions'];
        let required = validateRules['required']=='true'?true:false;
        let validateErrors = [];

        if (!files.length) {
            validateErrors['type'] = 'required';
            validateErrors['message'] = this.app.ttrans('The image you tried to upload is invalid');
            return validateErrors;
        }
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            let extensionFile = file.name.split('.').pop();

            if (extensions.indexOf(extensionFile.toLowerCase()) == -1) {
                validateErrors['type'] = 'extension';
                if(this.app.getConfig('LANG', 'en') == 'jp'){
                    validateErrors['message'] = this.app.ttrans('アップロードしようとした画像は不正です。');
                    if(this.app.getConfig('TOP_LANG_ID') == this.app.constant.JA_LANGUAGE_ID){
                        validateErrors['message'] = this.app.ttrans('アップロードしようとした画像は不正です。');
                    }else {
                        validateErrors['message'] = this.app.ttrans('The image you tried to upload is invalid.');
                    }
                }
                else {
                    validateErrors['message'] = this.app.ttrans('拡張は無効です。');
                    if(this.app.getConfig('TOP_LANG_ID') == this.app.constant.JA_LANGUAGE_ID){
                        validateErrors['message'] = this.app.ttrans('拡張は無効です。');
                    }else {
                        validateErrors['message'] = this.app.ttrans('Extension is invalid.');
                    }
                }
            }

            if (parseInt(file.size) > parseInt(maxSize) * 1024) {
                validateErrors['type'] = 'size';
                if(this.app.getConfig('LANG', 'en') == 'jp'){
                    validateErrors['message'] = this.app.ttrans('画像のアップロード制限は5MBです。');
                    if(this.app.getConfig('TOP_LANG_ID') == this.app.constant.JA_LANGUAGE_ID){
                        validateErrors['message'] = this.app.ttrans('画像のアップロード制限は5MBです。');
                    }else {
                        validateErrors['message'] = this.app.ttrans('Please upload an image within 5MB.');
                    }
                }
                else
                {
                    validateErrors['message'] = this.app.ttrans('Please upload an image within 5MB.');
                    if(this.app.getConfig('TOP_LANG_ID') == this.app.constant.JA_LANGUAGE_ID){
                        validateErrors['message'] = this.app.ttrans('画像のアップロード制限は5MBです。');
                    }else {
                        validateErrors['message'] = this.app.ttrans('Please upload an image within 5MB.');
                    }
                }
                break;
            }
        }
        return validateErrors;
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
            $('.confirm_'+field).attr('src', fileSource);
            callback(fileSource);
        }
    }


}
