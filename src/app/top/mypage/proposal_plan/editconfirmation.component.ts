import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';

@Component({
    selector: 'plan-confirmation',
    templateUrl: './editconfirmation.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './editconfirmation.component.css'
    ]
})
export class EditConfirmationComponent implements OnInit {
    private data: any;
    private detailSuggestPlan;
    private plan_suggest = {};
    private request_id;
    private guider = {};
    private languages = {};
    private timeStart;
    private request = {};
    private year_request;
    private month_request;
    private day_request;
    private weekday_request;
    private year;
    private month;
    private day;
    private weekday;
    private year_created_at;
    private month_created_at;
    private day_created_at;
    private weekday_created_at;
    private time_request_hour;
    private time_request_min;
    private time_start = [];
    private languageName = this.app.language;
    private currentID = this.app.curMember ? this.app.curMember.id : null;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private dataMessage = {
        'plan_id': '',
        'member_id': this.currentID,
        'language_id': this.language_id,
        'content':'',
    };
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }


    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.app.checkDisplayLanguage(this.languageName);
        this.data = this.app.getConfig('editconfirmProposalPlan');
        if (this.data && this.app.curMember) {
            this.data = JSON.parse(this.data);
            this.timeStart = JSON.parse(this.data.formPlan.plan_time_start);
            this.dataMessage.content = this.data.message;
            this.dataMessage.plan_id = this.data.formPlan.id;
            this.request = this.data.request;
            if(this.request['date_plan']){
                this.year_request = this.request['date_plan'].slice(0,4);
                this.month_request = this.request['date_plan'].slice(5,7);
                this.day_request = this.request['date_plan'].slice(8,10);
                let d = new Date(this.request['date_plan'].slice(0,10));
                let thu = d.getDay();
                this.weekday_request = this.app.getDayOfWeek(thu);
            }
            if(this.data.formPlan.date_plan){
                this.year = this.data.formPlan.date_plan.slice(0,4);
                this.month = this.data.formPlan.date_plan.slice(5,7);
                this.day = this.data.formPlan.date_plan.slice(8,10);
                let d = new Date(this.data.formPlan.date_plan.slice(0,10));
                let thu = d.getDay();
                this.weekday = this.app.getDayOfWeek(thu);
            }
            if(this.data.created_at){
                this.year_created_at = this.data.created_at.slice(0,4);
                this.month_created_at = this.data.created_at.slice(5,7);
                this.day_created_at = this.data.created_at.slice(8,10);
                let d = new Date(this.data.created_at.slice(0,10));
                let thu = d.getDay();
                this.weekday_created_at = this.app.getDayOfWeek(thu);
            }
            let time_request = this.data.formPlan.time_request.split(':');
            this.time_request_hour = time_request[0];
            this.time_request_min = time_request[1];
            let time_start;
            let time_hour_min = [];
            // console.log(this.data.formPlan);
            $.each(this.timeStart,function (index,value) {
                time_start = value.time_start.split(':');
                time_hour_min.push({'hour':time_start[0],'min':time_start[1]});
            });
            this.time_start = time_hour_min;

        } else if(this.app.curMember) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.languageName]);
        }
        this.setTitleAndDescription();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - confirm the proposal of  the travel request  - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page - the confirmation screen for the revised travel request proposal.  "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

    backAdd(){
        this.router.navigate([this.languageName + '/mypage/suggestion/reservation']);
    }

    save() {
        this.data.formPlan['form_complete'] = true;
        this.app.post('save_plan', this.data.formPlan).then(res => {
            if (res.status == 200) {
                if(this.data.message != ''){
                    this.app.post('save_message_for_guider', this.dataMessage).then(res => {
                        if (res.status == 200) {
                            this.router.navigate([this.languageName + '/mypage/proposal_plan/editcompletion']);
                        }
                    });
                }else {
                    this.router.navigate([this.languageName + '/mypage/proposal_plan/editcompletion']);
                }
            } else {
            }
        });
    }
}

