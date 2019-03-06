import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';

@Component({
    selector: 'mypage-plan-detail',
    templateUrl: './detail.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './detail.component.css'
    ]
})
export class DetailComponent implements OnInit {
    private data = {};
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.language;
    private curMember = this.app.getCurrentMember();
    private prefecture;
    private plan_id;
    private listPrefecture;
    private addressMap;
    private time_request;
    private time_request_hour;
    private time_request_min;
    private time_start = [];
    private plan_language;
    private listLanguage;
    private is_active = this.app.getConfig('language_id_plan');
    private language_plan_id = this.app.getConfig('language_id_plan');
    private language_add = [];
    private listCountry;
    private countryName;
    private country_select = this.app.constant.COUNTRY_DEFAULT;


    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        $(".modal-dialog-edit-status-other").css("display","none");
        this.app.checkDisplayLanguage(this.languageName);
        this.getListLanguageContent();
        this.setTitleAndDescription();
        this.route.params.subscribe((params) => {
            if (params['id'] && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
                this.plan_id = params['id'];
                this.app.get('mypage/plan/detail', {plan_id: params['id'],member_id: this.curMember.id, language_id: this.language_plan_id}).then(res => {
                    if (res.status == 200) {
                        this.getListCountry(this.language_plan_id);
                        this.data = res.json().data;
                        this.country_select =  res.json().data.country_id;
                        this.app.get('cities/list_by_country', {'language_id': this.language_plan_id, 'country_id': this.country_select}).then(res => {
                            if (res.status == 200) {
                                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                                let city_id = this.data['city_id'];
                                if(this.listPrefecture) {
                                    this.prefecture = this.listPrefecture[parseInt(city_id)]
                                    let country_id = this.country_select;
                                    if(this.listCountry){
                                        this.countryName = this.listCountry[parseInt(country_id)];
                                    }
                                    //get address map then get prefecture success
                                    if (parseInt(this.plan_language) == parseInt(this.app.constant.TRUE)) {
                                        if(parseInt(this.countryName) == parseInt(this.app.constant.COUNTRY_DEFAULT)){
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + 'Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
                                        }else {
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + this.countryName+ '&zoom=16&maptype=roadmap&language=ja';
                                        }
                                    } else {
                                        if(parseInt(this.countryName) == parseInt(this.app.constant.COUNTRY_DEFAULT)){
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + 'Japan&zoom=16&maptype=roadmap&language=en&region=JP';
                                        }else {
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + this.countryName+ '&zoom=16&maptype=roadmap&language=en';
                                        }
                                    }
                                }

                            }
                        });


                        if(res.json().data.time_request){
                            this.time_request = res.json().data.time_request;
                            let time_request = res.json().data.time_request.split(':');
                            this.time_request_hour = time_request[0];
                            this.time_request_min = time_request[1];
                            let time_start;
                            let time_hour_min = [];
                            $.each(res.json().data.time_start,function (index,value) {
                                time_start = value.split(':');
                                time_hour_min.push({'hour':time_start[0],'min':time_start[1]});
                            });
                            this.time_start = time_hour_min;
                        }
                        this.language_add = this.app.pushToArr(res.json().data.plan_translates,'id','display_name');
                    } else if(res.status == 401) {
                        alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                        this.router.navigate([this.languageName]);
                    }
                });
            }
        });
        // this.plan_language = $('#plan-lang').val();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - details of the travel plan - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('My page - the details of the travel  plan. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')
            }
        ]);
    }
    getListCityByCountry(language_id){
        this.app.get('cities/list_by_country',{'language_id':language_id,'country_id': 1}).then(res=>{
            if(res.status == 200){
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }
    settingCalendar(){
        this.router.navigate([this.languageName + '/mypage/plan/dateselect/'+this.plan_id]);
    }

    showCancel(){
        $(".modal-dialog-cancel").css("display","block");
    }
    calcelPLan(){
            $(".modal-dialog-cancel").css("display","none");
        this.app.post('mypage/plan/delete_plan',{plan_id:this.plan_id,language_id:this.language_plan_id}).then(res=>{
            if(res.status == 200){
                this.router.navigate([this.languageName+'/mypage/plan']);
            }else {
                alert('error');
            }
        });
    }
    cancel_modal(){
            $(".modal-dialog-cancel").css("display","none");
    }
    cancel_modal_edit(){
        $(".modal-dialog-edit-status-offering").css("display","none");
    }
    cancel_modal_edit_other(){
        $(".modal-dialog-edit-status-other").css("display","none");

    }

    selectPlan(key,value){
        this.route.params.subscribe((params) => {
            if (params['id']) {
                this.plan_id = params['id'];
                this.app.get('mypage/plan/detail', {plan_id: params['id'],member_id: this.curMember.id, language_id: key}).then(res => {
                    if (res.status == 200) {
                        if(res.json().data.proposal_title != null){
                            this.is_active = key;
                            this.data = res.json().data;
                            this.language_plan_id = key;
                            this.country_select = res.json().data.country_id;
                            this.app.get('cities/list_by_country', {'language_id': key, 'country_id': this.country_select}).then(res => {
                                if (res.status == 200) {
                                    this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                                    this.prefecture = this.listPrefecture[this.data['city_id']];
                                    let country = this.listCountry[parseInt(this.country_select)];
                                    if (this.plan_language == this.app.constant.TRUE) {
                                        if(country == this.app.constant.COUNTRY_DEFAULT){
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + 'Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
                                        }else {
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + country+ '&zoom=16&maptype=roadmap&language=ja';
                                        }
                                    } else {
                                        if(country == this.app.constant.COUNTRY_DEFAULT){
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + 'Japan&zoom=16&maptype=roadmap&language=en&region=JP';
                                        }else {
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + country+ '&zoom=16&maptype=roadmap&language=en';
                                        }
                                    }
                                }
                            });
                            let time_request = res.json().data.time_request.split(':');
                            this.time_request_hour = time_request[0];
                            this.time_request_min = time_request[1];
                            let time_start;
                            let time_hour_min = [];
                            $.each(res.json().data.time_start,function (index,value) {
                                time_start = value.split(':');
                                time_hour_min.push({'hour':time_start[0],'min':time_start[1]});
                            });
                            this.time_start = time_hour_min;
                        }else {
                            this.app.setConfig('Plan_Language',key);
                            this.router.navigate([this.app.language+'/mypage/plan/edit/'+this.plan_id])
                            // alert(this.app.ttrans('データなし'));
                        }
                    }else {
                        this.app.setConfig('Plan_Language',key);
                        this.router.navigate([this.app.language+'/mypage/plan/edit/'+this.plan_id])
                        // alert(this.app.ttrans('データなし'));
                    }
                });
            }
        });
    }

    goToEditPopup(){
        this.app.setConfig('Plan_Language',$('.active').val());
        $(".modal-dialog-edit-status-other").css("display","block");
    }

    goToEditlPLan(){
        this.router.navigate([this.languageName+ '/mypage/plan/edit/'+this.plan_id]);
    }

    getListLanguageContent() {
        this.app.get('languages', {'active': 1, 'is_display': 1}).then(res => {
            if (res.status === 200) {
                this.listLanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }
    reviewPlan(){
        this.app.setConfig('plan_review_language_id',this.language_plan_id);
    }
    getListCountry(language_plan_id){
        this.app.get('countries/list_by_language',{'language_id':language_plan_id}).then(res=>{
            if(res.status == 200){
                this.listCountry = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }


}

