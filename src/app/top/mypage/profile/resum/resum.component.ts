import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../shared/form-data';
import {UploadService} from "../../../../shared/upload/upload.service";
import {window} from "rxjs/operator/window";


@Component({
    selector: 'resum',
    templateUrl: './resum.component.html',
    styleUrls: [
        './resum.component.css',
        '../../../../../assets/top/css/mypage.css',
        '../../../../../assets/top/css/remodal-default-theme.css',
        '../../../../../assets/top/css/remodal.css'
    ]
})
export class ResumComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getConfig('TOP_LANG');
    private params = {'language_id':this.language_id,'member_id':''};
    private data = {
        'form_confirm': true,
        'is_agree_conditions': true,
        'images': 0
    };
    private memberImages;
    private imageError = [];
    private showImages = [];
    private top_token = this.app.getConfig('TOP_TOKEN');
    private images = {'plan_images': [{'identify_image': ''}]};
    constructor(
                private app: AppService,
                private route: ActivatedRoute,
                private router: Router,
                private upload: UploadService
    ) {
    }

    ngOnInit() {
        this.app.checkAuth();
        this.app.checkDisplayLanguage(this.languageName);
        this.params.member_id = this.app.curMember ? this.app.curMember.id : 1;
        this.route.params.subscribe((params) => {
            if (params && this.app.curMember) {
                this.app.get('mypage/profile', this.params).then(res => {
                    if (res.status == 200) {
                        this.memberImages = res.json().data;
                    } else {
                        alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                        this.router.navigate([this.app.language]);
                    }
                });
            }
        });
        this.setTitleAndDescription();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - 本人確認書類申請 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 本人確認書類登録画面。ガイド登録には必ず本人確認が必要です。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    addImage(){
        var hidden = $('.tb-abc').find('fieldset.hidden').length;
        var i = 3 - hidden;
        $('#identify_image_'+i).removeClass('hidden');
    }

    removeImage(i){
        switch (i)
        {
            case 0:
                break;
            case 1:
                this.memberImages.identify_image_1 = '';
                break;
            case 2:
                this.memberImages.identify_image_2 = '';
                break;
            // case 3:
            //     this.memberImages.identify_image_3 = '';
            //     break;
            // case 4:
            //     this.memberImages.identify_image_4 = '';
            //     break;
            // case 5:
            //     this.memberImages.identify_image_5 = '';
            //     break;
            // case 6:
            //     this.memberImages.identify_image_6 = '';
            //     break;
            // case 7:
            //     this.memberImages.identify_image_7 = '';
            //     break;
            // case 8:
            //     this.memberImages.identify_image_8 = '';
            //     break;
            // case 9:
            //     this.memberImages.identify_image_9 = '';
            //     break;
        }
        $('#identify_image_'+i).addClass('hidden');
    }

    confirmSaveData(){
        $('#show-image').html("");
        if($('.input_identify_image_0').is(":visible") == true){
            if ($('input#identify_image_0')[0].files[0]) {
                this.data['identify_image_0'] = this.upload.getDataFileResume('identify_image_0');
            } else {
                if(this.memberImages && this.memberImages.identify_image_0 ){
                    this.data['identify_image_0'] = this.memberImages.identify_image_0;
                }else {
                    this.data['identify_image_0'] = '';
                }
            }
        }
        if($('.input_identify_image_1').is(":visible") == true){
            if ($('input#identify_image_1')[0].files[0]) {
                this.data['identify_image_1'] = this.upload.getDataFileResume('identify_image_1');
            } else {
                if(this.memberImages && this.memberImages.identify_image_1 ){
                    this.data['identify_image_1'] = this.memberImages.identify_image_1;
                }else {
                    this.data['identify_image_1'] = '';
                }
            }
        }
        if($('.input_identify_image_2').is(":visible") == true){
            if ($('input#identify_image_2')[0].files[0]) {
                this.data['identify_image_2'] = this.upload.getDataFileResume('identify_image_2');
            } else {
                if(this.memberImages && this.memberImages.identify_image_2 ){
                    this.data['identify_image_2'] = this.memberImages.identify_image_2;
                }else {
                    this.data['identify_image_2'] = '';
                }
            }
        }
        this.data['images_delete'] = JSON.stringify(this.memberImages);

            // //show image
            if ($('input#identify_image_0')[0].files[0]) {
                this.getImageSource('identify_image_0', $('input#identify_image_0')[0].files[0], function (data) {
                    $('#show-image').append("<div class='profile-img'><img src='" + data + "' width='100%' height='250px'></div>");
                });
            } else {
                if(this.memberImages && this.memberImages.identify_image_0){
                    $('#show-image').append("<div class='profile-img'><img src='"+ this.app.constant.PRIVATE_URL + '?url=' + this.memberImages.identify_image_0 + '&top_token=' + this.top_token + "' width='280px' height='250px'></div>");
                }
            }
            if ($('input#identify_image_1')[0].files[0]) {
                this.getImageSource('identify_image_1', $('input#identify_image_1')[0].files[0], function (data) {
                    $('#show-image').append("<div class='profile-img'><img src='" + data + "' width='100%' height='250px'></div>");
                });
            } else {
                if(this.memberImages && this.memberImages.identify_image_1){
                    $('#show-image').append("<div class='profile-img'><img src='"+ this.app.constant.PRIVATE_URL + '?url=' + this.memberImages.identify_image_1 + '&top_token=' + this.top_token + "' width='280px' height='250px'></div>");
                }
            }
            if ($('input#identify_image_2')[0].files[0]) {
                this.getImageSource('identify_image_2', $('input#identify_image_2')[0].files[0], function (data) {
                    $('#show-image').append("<div class='profile-img'><img src='" + data + "'width='100%' height='250px'></div>");
                });

            } else {
                if(this.memberImages && this.memberImages.identify_image_2){
                    $('#show-image').append("<div class='profile-img'><img src='"+ this.app.constant.PRIVATE_URL + '?url=' + this.memberImages.identify_image_2 + '&top_token=' + this.top_token + "' width='280px' height='250px'></div>");
                }
            }
        this.app.post('mypage/profile/resume/identify_image', this.data).then(res => {
            if (res.status == 200) {
                $(".modal-dialog-01").css("display","block");
            } else {
                this.imageError = res.json();
            }
        });

    }

    saveData(){
        this.data['form_complete'] = true;
        this.app.post('mypage/profile/resume/identify_image', this.data).then(res => {
            if (res.status == 200){
                // this.app.curMember.approve_guide = 2;
                this.router.navigate([this.languageName + '/mypage/profile/request']);
            }
        });
    }

    showData(){
        $('#identify_image').show();
        $('.button_hide').hide();
    }

    close_modal(){
        $(document).on('click', '.close_modal_approve_guide', function () {
            $(".modal-dialog-01").css("display","none");
        });
        this.imageError = [];
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
}

