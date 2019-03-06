import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
import {AddComponent} from "./add.component";
// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

@Component({
    selector: 'plan-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: [
        '../../../../assets/top/css/suggest.css',
        './confirmation.component.css'
    ]
})
export class ConfirmationComponent implements OnInit {
    private data: any;
    private languageName = this.app.getCurrentLanguage();
    private request = {};
    private member = {};
    private category = {};
    private timeStart: any;
    private prefecture: any;
    private listPrefecture: any;
    private year;
    private month;
    private day;
    private weekday;
    private city_name;
    private time_request_hour;
    private time_request_min;
    private time_request_required_hour;
    private time_request_required_min;
    private time_request_required;
    private weekday_created;
    private weekday_date_plan;
    private weekday_date_end;
    private time_start_hour;
    private time_start_min;
    private language_id = this.app.getConfig('TOP_LANG_ID');

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
}
    ngOnInit() {
        this.app.checkAuthGuider();
        window.scroll(0,0);
        this.app.checkDisplayLanguage(this.languageName);
        this.data = this.app.getConfig('confirmPlan');
        if (this.data && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.data = JSON.parse(this.data);
            this.city_name = this.data.city_name;
            this.timeStart = JSON.parse(this.data.formPlan.plan_time_start);
            let time_start = this.timeStart[0].time_start.split(':');
            this.time_start_hour = time_start[0];
            this.time_start_min = time_start[1];
            this.request = this.data.request;
            let time_request = this.data.request.time_start.split(':');
            this.time_request_hour = time_request[0];
            this.time_request_min = time_request[1];
            let time_request_required = this.data.request.plan_hour.split(':');
            this.time_request_required_hour = time_request_required[0];
            this.time_request_required_min = time_request_required[1];
            this.time_request_required = this.data.request.plan_hour;
            this.member = this.data.member;
            this.category = this.data.category;

            if(this.data.formPlan.date_plan){
                this.year = this.data.formPlan.date_plan.slice(0,4);
                this.month = this.data.formPlan.date_plan.slice(5,7);
                this.day = this.data.formPlan.date_plan.slice(8,10);
                let d = new Date(this.data.formPlan.date_plan.slice(0,10));
                let thu = d.getDay();
                this.weekday = this.app.getDayOfWeek(thu);
            }
            if(this.request['created_at']){
                let d = new Date(this.request['created_at'].slice(0,10));
                let thu = d.getDay();
                this.weekday_created = this.app.getDayOfWeek(thu);
            }
            if(this.request['date_plan']){
                let d = new Date(this.request['date_plan'].slice(0,10));
                let thu = d.getDay();
                this.weekday_date_plan = this.app.getDayOfWeek(thu);
            }
            if(this.request['date_end']){
                let d = new Date(this.request['date_end'].slice(0,10));
                let thu = d.getDay();
                this.weekday_date_end = this.app.getDayOfWeek(thu);
            }
        } else if(this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            alert(this.app.ttrans("このリンクはあなたがアクセスできません。"));
            this.router.navigate([this.languageName]);
        }
        this.setTitleAndDescription();
    }

    backAdd(){
        this.router.navigate([this.languageName + '/suggestion/plan/add/'+this.data.formPlan.request_id]);
    }

    save() {
        this.data.formPlan['form_complete'] = true;
        this.app.post('save_plan', this.data.formPlan).then(res => {
            if (res.status == 200) {
                this.router.navigate([this.languageName + '/suggestion/plan/completion']);
            } else {
            }
        });
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('旅リクエストへのプラン提案確認　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('旅リクエストへのガイドからの提案確認画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

}

