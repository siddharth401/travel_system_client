import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
import {UploadService} from "../../../shared/upload/upload.service";
import * as moment from 'moment';
import {stringify} from "querystring";

@Component({
    selector: 'date-select',
    templateUrl: './dateselect.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './dateselect.component.css'
    ]
})
export class DateSelectComponent implements OnInit {
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router,
                private upload: UploadService) {
    }
    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private data = {plan_info: {},plan_calendar:[],month : []};
    private plan_id;
    private currentYear = parseInt(moment().format('YYYY'));
    private currentMonth = moment().add(1, 'day').format('Y-MM');
    private year = parseInt(moment().format('YYYY'));
    private month = parseInt(moment().format('M'));
    private  max;
    private  min;
    private modifyData = [];
    private dataListMonth = [];
    private month_calendar;
    private language_plan_id = this.app.getConfig('language_id_plan')?this.app.getConfig('language_id_plan'):'';


    ngOnInit() {
        this.app.checkAuthGuider();
        this.app.checkDisplayLanguage(this.languageName);
        if (this.month >= 1 && this.month <= 4) {
            this.month_calendar = 4;
        } else if (this.month <= 8) {
            this.month_calendar = 8;
        }else {
            this.month_calendar = 12;
        }
        if(this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.route.params.subscribe((params) => {
                this.plan_id = params['id'];
                this.getListCalendar(this.month,this.year);
            });
        }
        this.setTitleAndDescription();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - 旅プラン実施月選択 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅プラン実施月選択画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getListCalendar(month,year){
        this.app.get('mypage/plan/dateselect', {
            plan_id: this.plan_id,
            language_id: this.language_id,
            month : month,
            year : year,
            plan_language_id:this.language_plan_id
        }).then(res => {
            if (res.status == 200) {
                let data = res.json().data;
                this.min =year +'-'+ ((data.plan_calendar[0]['month'] < 10) ? '0' + data.plan_calendar[0]['month'] : data.plan_calendar[0]['month']);
                this.max =year +'-'+ ((data.plan_calendar[3]['month'] < 10) ? '0' + data.plan_calendar[3]['month'] : data.plan_calendar[3]['month']);
                let dataListMonth = res.json().data.plan_calendar;
                let modifyData = [];
                if(dataListMonth.length > 0) {
                    for(let i = 0; i < dataListMonth.length; i ++){
                        modifyData[i] = {list: [], month: ''};
                        modifyData[i].list = this.separateDataOnWeek(dataListMonth[i]);
                        modifyData[i].month = (dataListMonth[i]['month'] < 10)? '0'+dataListMonth[i]['month']: dataListMonth[i]['month'];
                    }
                    this.modifyData = modifyData;
                }
                this.data = data;
            } else if(res.status == 401) {
                alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                this.router.navigate([this.languageName]);
            }
        });
    }

    separateDataOnWeek(data) {
        // add days to full first week
        let dayofweek = data['day'][0].dayofweek;
        if (dayofweek != 7){
            for(let i = 0; i < dayofweek; i ++){
                data['day'].unshift({})
            }
        }
        // separate week to each array from data
        let data_month = this.chunk(data['day'], 7);
        return data_month
    }
    //separate from one array to multi array on per week on calendar
    chunk(arr, len = 7) {
        var chunks = [],
            i = 0,
            length = arr.length;
        while (i < length) {
            chunks.push(arr.slice(i, i += len));
        }
        return chunks;
    }

    clickMonth(month, year, click){
        let currentMonth = parseInt(month);
        let currentYear = parseInt(year);
        var is_click;
        if(click == 'next') {
            if (month >= 1 && month <= 4) {
                this.month_calendar = 8;
                currentMonth = 5;
            } else if (month <= 8) {
                this.month_calendar = 12;
                currentMonth = 9;
            }else {
                this.month_calendar = 1;
                this.year += 1;
                currentMonth = 1;
                currentYear += 1;
            }
        } else {
                if(month <= 12 && month >= 9){
                    this.month_calendar = 8;
                    currentMonth = 8;
                }else if(month <= 8 && month >= 5) {
                    this.month_calendar = 4;
                    currentMonth = 4;
                }else {
                    this.month_calendar = 12;
                    currentMonth = 9;
                    currentYear -= 1;
                    this.year -= 1;
                }
            }
        this.getListCalendar(currentMonth,currentYear);
    }

    planDetail(){
        this.router.navigate(['/'+this.languageName + '/mypage/plan/detail/' + this.plan_id]);
    }
}

