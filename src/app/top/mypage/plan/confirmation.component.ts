import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
    selector: 'plan-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './confirmation.component.css'
    ]
})
export class ConfirmationComponent implements OnInit {
    private data: any;
    private languages = {};
    private timeStart: any;
    private listPrefecture;
    private language_plan_name;
    private listLanguage;
    private addressMap;

    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    ngOnInit() {
        this.app.checkAuthGuider();
        window.scroll(0,0);
        this.setTitleAndDescription();
        this.app.checkDisplayLanguage(this.languageName);
        this.getListCityByCountry();
        this.getListLanguageContent();
        this.data = this.app.getConfig('confirmCreatePlan');
        if (this.data && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.data = JSON.parse(this.data);
            this.timeStart = JSON.parse(this.data.formPlan.plan_time_start);
            this.languages = this.data.multiplelanguage;
            if (this.app.uploadImagePlans.length > 0) {
                for(let i =1 ; i <= 10 ; i ++ ){
                    delete this.data.formPlan['image-'+i];
                }
                for (let i = 0; i < this.app.uploadImagePlans.length; i++) {
                    this.getImageSource('image-'+(i+1), this.app.uploadImagePlans[i], function (data) {
                        $('.show-image').append("<img style=' max-width: 50%;padding-right: 10px; box-sizing: border-box' src='" + data + "'>");
                    });
                }
            }else {
                // this.app.delConfig('confirmCreatePlan');
                // this.router.navigate([this.languageName+'/mypage/plan/create']);
            }
            if(this.data.formPlan.plan_language_id == this.app.constant.TRUE){
                if (this.data.formPlan.country_id == this.app.constant.COUNTRY_DEFAULT) {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data.formPlan.address_meeting + this.data.prefectureText + ',Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
                }else {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data.formPlan.address_meeting + this.data.prefectureText + this.data.country_name+'&zoom=16&maptype=roadmap&language=ja';
                }
            }else {
                if (this.data.formPlan.country_id == this.app.constant.COUNTRY_DEFAULT) {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data.formPlan.address_meeting + this.data.prefectureText + ',Japan&zoom=16&maptype=roadmap&language=en&region=JP';
                } else {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data.formPlan.address_meeting +','+ this.data.prefectureText+ ',' + this.data.country_name+ '&zoom=16&maptype=roadmap&language=en';
                }
            }


        } else if(this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.languageName + '/mypage/plan/create']);
        }
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - Confirm the the travel plan - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('My page - the confirmation screen for the travel plan. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')
            }
        ]);
    }

    getListLanguageContent() {
        this.app.get('languages', {'active': 1, 'is_display': 1}).then(res => {
            if (res.status === 200) {
                this.listLanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }

    save() {
        for (let i = 0; i < this.app.uploadImagePlans.length; i++) {
            this.data.formPlan['image-' + (i + 1)] = this.app.uploadImagePlans[i];
        }
        this.data.formPlan['form_complete'] = true;
        this.app.post('mypage/plan/add', this.data.formPlan).then(res => {
            if (res.status == 200) {
                this.app.number_on_header.count_plans = this.app.number_on_header.count_plans + 1;
                this.router.navigate([this.languageName + '/mypage/plan/apply']);
            } else {
                console.log('error');
            }
        });
    }

    getListCityByCountry() {
        this.app.get('cities/list_by_country',{'language_id':this.language_id,'country_id': 1}).then(res => {
            if (res.status === 200) {
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
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
}

