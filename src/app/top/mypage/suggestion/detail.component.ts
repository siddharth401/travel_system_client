import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';


@Component({
    selector: 'suggest-plan-detail',
    templateUrl: './detail.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './detail.component.css'
    ]
})
export class DetailComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.language;
    private data = {};
    private member = {};
    private request = {};
    private plan_suggest = {};
    private guider = {};
    private listPrefecture:any;
    private prefecture;
    private plan_history = [];
    private checkListHistoryShow;
    private checkListHistory = false;
    private year;
    private month;
    private day;
    private weekday;
    private year_created;
    private month_created;
    private day_created;
    private weekday_created;
    private year_request;
    private month_request;
    private day_request;
    private weekday_request;
    private time_request_hour;
    private time_request_min;
    private time_start = [];
    private plan_id;
    private detailSuggestPlanOther = {'id':'','city_id':'','date_plan':'','time_request':'','guider':'','member_id':'','start_time':'','time_start':[], 'time_apply':'','price':'','content':'','address_meeting':'','plan_ranking':'','number_people':'','date_actual':''};
    private listPrefectureOther;
    private prefectureNameOther;



    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.app.checkDisplayLanguage(this.languageName);
        this.getListPrefecture();
        this.route.params.subscribe((params) => {
            if (params['id'] && this.app.curMember) {
                this.plan_id = params['id'];
                this.app.get('mypage/suggestion/suggest_plan', {plan_id: params['id'], language_id: this.language_id}).then(res => {
                    if (res.status == 200) {
                        this.data = res.json().data;
                        this.member = res.json().data.member;
                        this.request = res.json().data.request;
                        this.plan_suggest = res.json().data.plan_suggest;
                        // this.guider = res.json().data.plan_suggest.guiders;
                        if(res.json().data.plan_suggest.proposal_title){
                            this.app.setConfig('title_plan',res.json().data.plan_suggest.proposal_title);
                        }
                        if(res.json().data.request.title){
                            this.app.setConfig('title_request',res.json().data.request.title);
                        }
                        if(res.json().data.request.id){
                            this.app.setConfig('booking_request_id',res.json().data.request.id);
                        }
                        this.app.setConfig('booking_plan_id',params['id']);

                        this.plan_history = res.json().data.plan_history;
                        this.checkListHistoryShow = res.json().data.plan_history;
                        if(this.checkListHistoryShow){
                            this.checkListHistory = false;
                        }else {
                            this.checkListHistory = true;
                        }
                        var prefecture = res.json().data.plan_suggest.city_id;
                        if(prefecture){
                            $.each(this.listPrefecture,function (index,value) {
                                if(prefecture == index){
                                    prefecture = value;
                                }
                            });
                        }
                        this.prefecture = prefecture;
                        if(res.json().data.request.date_plan){
                            let d = new Date(res.json().data.request.date_plan.slice(0,10));
                            let thu = d.getDay();
                            this.weekday_request = this.app.getDayOfWeek(thu);
                        }
                        if(res.json().data.plan_suggest.created_at){
                            let d = new Date(res.json().data.plan_suggest.created_at.slice(0,10));
                            let thu = d.getDay();
                            this.weekday_created = this.app.getDayOfWeek(thu);
                        }
                        if(res.json().data.plan_suggest.date_plan){
                            let d = new Date(res.json().data.plan_suggest.date_plan.slice(0,10));
                            let thu = d.getDay();
                            this.weekday = this.app.getDayOfWeek(thu);
                        }
                        this.setTitleAndDescription();
                    } else {
                        alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                        this.router.navigate([this.app.language]);
                    }
                });
            }
        });
        $(".modal-dialog").css("display","none");
        $(".modal-dialog-history").css("display","none");

    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - confirm the proposal of the travel request  - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page - The confirmation screen of  the travel request proposal. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }
    getListPrefecture(){
        this.app.get('cities/list_by_country',{'language_id':this.language_id,'country_id': 1}).then(res=>{
            if(res.status == 200){
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    goToF31(){
        this.app.setConfig('detailSuggestPlan',JSON.stringify({
            plan_suggest: this.plan_suggest,
            request_id: this.request['id'],
            request: this.request,
            request_num_people: this.request['num_people'],
            guider:this.plan_suggest['guiders'],
            member:this.member,
            prefecture:this.prefecture
        }));
        this.router.navigate(['/'+this.languageName + '/mypage/suggestion/reservation']);
    }
    goToF34(){
        this.router.navigate(['/'+this.languageName + '/mypage/suggestion/detail/'+this.plan_suggest['id']+'/message_input']);
    }

    reject(){
        // if (confirm(this.app.ttrans("Would you like to rejected"))) {
            this.app.post('mypage/suggestion/cancel',{plan_id:this.plan_id,language_id:this.language_id}).then(res=>{
               if(res.status == 200){
                   $(".modal-dialog").css("display","none");
                   $(".modal-dialog-history").css("display","none");
                   $('.hide-button').hide();
                   // this.router.navigate(['/']);
               } else {
                    alert('拒否が失敗しました。');
               }
            });
        // }


    }
    confirmReject(){
        $(".modal-dialog").css("display","block");
        $(".modal-dialog-history").css("display","none");
    }

    close_modal(){
            $(".modal-dialog").css("display","none");
            $(".modal-dialog-history").css("display","none");
    }


    showDetail(id){
        $(".modal-dialog").css("display","none");
        $(".modal-dialog-history").css("display","block");
        window.scroll(0,0);
        this.app.get('mypage/detail_history_of_plan',{id:id}).then(res=>{
            if(res.status == 200){
                this.detailSuggestPlanOther = res.json().data;
                this.app.get('prefectures/prefecture_by_language',{'language_id':this.language_id}).then(res=>{
                    if(res.status == 200){
                        let prefecture_id = this.detailSuggestPlanOther.city_id;
                        let prefectureName;
                        this.listPrefectureOther = this.app.arrToList(res.json().data, 'id', 'name');
                        $.each(this.listPrefectureOther,function (index,value) {
                            if(prefecture_id == index){
                                prefectureName = value;
                            }
                        });
                        this.prefectureNameOther = prefectureName;
                    }
                });
            }
        });

    }

}

