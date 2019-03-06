import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';

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
    private detailSuggestPlan;
    private plan_suggest;
    private request_id;
    private guider = {};
    private languages = {};
    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private booking_id;
    private num_people;
    private request;
    private curMember = this.app.getCurrentMember();
    private year;
    private month;
    private day;
    private weekday;
    private time_request_hour;
    private time_request_min;
    private time_start = [];
    private countryName;

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.app.checkDisplayLanguage(this.languageName);
        if(this.language_id == 1){
            this.countryName = '日本';
        }else {
            this.countryName = 'Japan';
        }
        this.setTitleAndDescription();
        this.data = this.app.getConfig('confirmReservation');
        if (this.data && this.app.curMember) {
            this.data = JSON.parse(this.data);
            this.languages = this.data.multiplelanguage;
            this.booking_id = this.data.booking_id;
        } else if(this.app.curMember) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.languageName])
        }
        if(this.app.getConfig('detailSuggestPlan') && this.app.curMember){

            this.detailSuggestPlan = JSON.parse(this.app.getConfig('detailSuggestPlan'));
            this.plan_suggest = this.detailSuggestPlan.plan_suggest;
            this.request_id = this.detailSuggestPlan.request_id;
            this.request = this.detailSuggestPlan.request;
            this.guider = this.detailSuggestPlan.guider;
            this.num_people = this.detailSuggestPlan.request_num_people;
            if(this.plan_suggest['date_plan']){
                this.year = this.plan_suggest['date_plan'].slice(0,4);
                this.month = this.plan_suggest['date_plan'].slice(5,7);
                this.day = this.plan_suggest['date_plan'].slice(8,10);
                let d = new Date(this.plan_suggest['date_plan'].slice(0,10));
                let thu = d.getDay();
                this.weekday = this.app.getDayOfWeek(thu);
            }
            if(this.plan_suggest['time_request']){
                var hour_min = [];
                hour_min  = this.plan_suggest['time_request'].split(':');
                this.time_request_hour = hour_min[0];
                this.time_request_min = hour_min[1];
                console.log(this.time_request_hour);
            }

            if(this.plan_suggest['time_start']){
                let time_start;
                let time_hour_min = [];
                $.each(this.plan_suggest['time_start'],function (index,value) {
                    time_start = value.split(':');
                    time_hour_min.push({'hour':time_start[0],'min':time_start[1]});
                });
                this.time_start = time_hour_min;
            }

        }
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - Confirm the reservaion at the proposal of  the travel request - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page - the reservation confirmation screen for the travel request proposal.  "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

    backAdd(){
        this.router.navigate([this.languageName + '/mypage/suggestion/reservation']);
    }

    payment() {
        let base_url = this.app.constant.BASE_WEB;
        window.location.href = base_url+'api/payment/charge/'+this.curMember.id+'/'+this.booking_id;
    }

    save() {
        this.data.formReservation['form_complete'] = true;
        this.app.post('mypage/suggestion/reservation', this.data.formReservation).then(res => {
            if (res.status == 200) {
                this.router.navigate([this.languageName + '/mypage/suggestion/reservation/completion']);
            } else {
            }
        });
    }
}

