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
    private data;
    private listPrefecture;
    private listPrefectureOther;
    private prefectureName;
    private prefectureNameOther;
    private plan_id;
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

    private detailRequests = {'id':'','language_id':'','plan_id':'','request_id':'','date_plan':'','desc':''};
    private detailSuggestPlan = {'id':'','city_id':'','country_id':'','date_plan':'','created_at':'','time_request':'','guider':'','member_id':'','start_time':'','time_start':[], 'time_apply':'','price':'','content':'','address_meeting':'','plan_ranking':'','number_people':'','date_actual':''};
    private detailSuggestPlanOther = {'id':'','city_id':'','country_id':'','date_plan':'','time_request':'','guider':'','member_id':'','start_time':'','time_start':[], 'time_apply':'','price':'','content':'','address_meeting':'','plan_ranking':'','number_people':'','date_actual':''};
    private listSuggestPlan = [];
    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private currentMemberID = this.app.getCurrentMember();
    private listCountry;
    private countryName;
    private countryNameOther;
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.getListCountry();
        this.app.checkDisplayLanguage(this.languageName);
        this.route.params.subscribe((params) => {
            if (params['id'] && this.app.curMember) {
                this.plan_id = params['id'];
                this.app.get('mypage/detail_suggest_plan',{plan_id:params['id'],language_id:this.language_id}).then(res=>{
                    if(res.status == 200){
                            this.data = res.json().data;
                            this.detailRequests = res.json().data.detailRequests[0];
                            this.detailSuggestPlan = res.json().data.detailSuggestPlan;
                            this.listSuggestPlan = res.json().data.listSuggestPlan;
                            if(this.detailSuggestPlan.country_id){
                                this.app.get('cities/list_by_country',{'language_id':this.language_id,'country_id': this.detailSuggestPlan.country_id}).then(res=>{
                                    if(res.status == 200){
                                        if(this.detailSuggestPlan.city_id){
                                            let prefecture_id = this.detailSuggestPlan.city_id;
                                            let prefectureName;
                                            this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                                            $.each(this.listPrefecture,function (index,value) {
                                                if(prefecture_id == index){
                                                    prefectureName = value;
                                                }
                                            });
                                            this.prefectureName = prefectureName;
                                        }
                                    }
                                });
                            }

                            if(this.detailSuggestPlan.country_id){
                                let country_name = '';
                                let country_id = this.detailSuggestPlan.country_id
                                $.each(this.listCountry,function (index,value) {
                                    if(country_id == index){
                                        country_name = value;
                                    }
                                });
                                this.countryName = country_name;
                            }

                            if(res.json().data.detailSuggestPlan.title){
                                this.app.setConfig('title_plan',res.json().data.detailSuggestPlan.title);
                            }

                            let time_request = res.json().data.detailSuggestPlan.time_request.split(':');
                            this.time_request_hour = time_request[0];
                            this.time_request_min = time_request[1];
                            let time_start;
                            let time_hour_min = [];
                            $.each(res.json().data.detailSuggestPlan.time_start,function (index,value) {
                                time_start = value.split(':');
                                time_hour_min.push({'hour':time_start[0],'min':time_start[1]});
                            });
                            this.time_start = time_hour_min;

                            if(this.detailRequests.date_plan){
                                this.year_request = this.detailRequests.date_plan.slice(0,4);
                                this.month_request = this.detailRequests.date_plan.slice(5,7);
                                this.day_request = this.detailRequests.date_plan.slice(8,10);
                                let d = new Date(this.detailRequests.date_plan.slice(0,10));
                                let thu = d.getDay();
                                this.weekday_request = this.app.getDayOfWeek(thu);
                            }

                            if(this.detailSuggestPlan.created_at){
                                this.year_created = this.detailSuggestPlan.created_at.slice(0,4);
                                this.month_created = this.detailSuggestPlan.created_at.slice(5,7);
                                this.day_created = this.detailSuggestPlan.created_at.slice(8,10);
                                let d = new Date(this.detailSuggestPlan.created_at.slice(0,10));
                                let thu = d.getDay();
                                this.weekday_created = this.app.getDayOfWeek(thu);
                            }
                            if(this.detailSuggestPlan.date_plan){
                                this.year = this.detailSuggestPlan.date_plan.slice(0,4);
                                this.month = this.detailSuggestPlan.date_plan.slice(5,7);
                                this.day = this.detailSuggestPlan.date_plan.slice(8,10);
                                let d = new Date(this.detailSuggestPlan.date_plan.slice(0,10));
                                let thu = d.getDay();
                                this.weekday = this.app.getDayOfWeek(thu);
                            }




                    } else {
                        alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                        this.router.navigate([this.languageName]);

                    }
                });
            }
        });
        this.setTitleAndDescription();
        if(this.app.getConfig('editconfirmProposalPlan')){
            this.app.delConfig('editconfirmProposalPlan');
        }
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - details of the travel request proposal - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page - the details of the travel request proposal. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

    goToF67(){
        this.router.navigate([this.languageName + '/mypage/proposal_plan/detail/'+this.plan_id+'/message_input']);
    }
    goToF64(){
        this.router.navigate([this.languageName + '/mypage/proposal_plan/edit/'+this.plan_id]);
    }

    close_modal(){

            $(".modal-dialog").css("display","none");
            $(".modal-dialog-cancel").css("display","none");
    }

    confirmCancel(){
        $(".modal-dialog-cancel").css("display","block");
    }


    showDetail(id){
        this.app.get('mypage/detail_history_of_plan',{id:id}).then(res=>{
            if(res.status == 200){
                this.detailSuggestPlanOther = res.json().data;
                if(this.detailSuggestPlanOther.country_id){
                    this.app.get('cities/list_by_country',{'language_id':this.language_id,country_id:this.detailSuggestPlanOther.country_id}).then(res=>{
                        if(res.status == 200){
                            let prefecture_id = this.detailSuggestPlanOther.city_id;
                            let prefectureName;
                            this.listPrefectureOther = this.app.arrToList(res.json().data, 'id', 'name');
                            $.each(this.listPrefectureOther,function (index,value) {
                                if(parseInt(prefecture_id) == parseInt(index)){
                                    prefectureName = value;
                                }
                            });
                            this.prefectureNameOther = prefectureName;
                        }
                    });
                }
                $(".modal-dialog").css("display","block");
            }
        });

    }
    calcelTaPLan(){
        // if (confirm(this.app.trans("本当に出した提案プランを取り下げますか？"))) {
            this.app.get('mypage/suggestion/cancel_taplan',{plan_id:this.plan_id,language_id:this.language_id,member_id:this.currentMemberID.id}).then(res=>{
                if(res.status == 200){
                    $(".modal-dialog-cancel").css("display","none");
                    this.router.navigate([this.languageName+'/mypage/proposal_plan']);
                } else {
                    $(".modal-dialog-cancel").css("display","none");
                    alert(this.app.ttrans('拒否が失敗しました。'));
                }
            });
        // } else {
        //     //Nothing
        // }
    }

    getListCountry(){
        this.app.get('countries/list_by_language',{'language_id':this.language_id}).then(res=>{
            if(res.status == 200){
                this.listCountry = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

}

