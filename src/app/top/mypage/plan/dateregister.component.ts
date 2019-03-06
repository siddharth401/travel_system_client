import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
import {UploadService} from "../../../shared/upload/upload.service";
import * as moment from 'moment';

@Component({
    selector: 'date-register',
    templateUrl: './dateregister.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './dateregister.component.css'
    ]
})
export class DateRegisterComponent implements OnInit {
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router,
                private upload: UploadService) {
    }

    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private data = {plan_info: {},time_start:[],plan_calendar:[]};
    private listTimeBooking = {};
    private dataDay = [];
    private month;
    private year;
    private dataMonthYear;
    private plan_id;
    private monthYear;
    private form_complete = false;
    private form_confirm = true;
    public currentDay = moment().format('Y-MM-DD');
    private language_plan_id = this.app.getConfig('language_id_plan')?this.app.getConfig('language_id_plan'):'';


    ngOnInit() {
        this.app.checkAuthGuider();
        this.app.checkDisplayLanguage(this.languageName);
        this.route.params.subscribe((params) => {
            if (params['id'] && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
                this.monthYear = params['month'];
                this.year = this.monthYear.substring(0,4);
                this.month = this.monthYear.substring(4);
                this.plan_id = params['id'];
                this.getDateCalendar();
            }
        });
        this.setTitleAndDescription();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - 旅プラン実施日登録 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅プラン実施日選択画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getDateCalendar(){
        this.app.get('mypage/plan/date_register', {
            plan_id: this.plan_id,
            language_id: this.language_id,
            month : this.month,
            year : this.year,
            plan_language_id:this.language_plan_id
        }).then(res => {
            if (res.status == 200) {
                this.data = res.json().data;
                this.listDayOfMonth(this.data.plan_calendar);
            } else if(res.status == 401) {
                alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                this.router.navigate([this.languageName]);
            }
        });
    }

    confirmSave() {
        this.app.post('mypage/plan/save_date_register', {
            days: this.dataDay,
            month : this.month,
            year : this.year,
            id: this.plan_id,
            language_id: this.language_id,
            form_confirm: this.form_confirm,
            form_complete: this.form_complete,
            plan_language_id:this.language_plan_id
        }).then(res => {
            // if (res.status === 200) {
                $(".modal-dialog").css("display","block");
            // }else {
            //     window.scrollTo(0,0);
            //     $(".modal-dialog").css("display","block");
            // }

        });
    }

    save_data(){
        $(".modal-dialog").css("display","none");
        this.form_complete = true;
        this.app.post('mypage/plan/save_date_register', {
            days: this.dataDay,
            month : this.month,
            year : this.year,
            id: this.plan_id,
            language_id: this.language_id,
            form_confirm: this.form_confirm,
            form_complete: this.form_complete,
            plan_language_id:this.language_plan_id
        }).then(res => {
            if (res.status == 200) {
                this.getDateCalendar();
                alert(this.app.ttrans('実施日が登録されました。'));
            }else {
                alert(this.app.ttrans('実施日が登録されませんでした。'));
            }
        });
    }
    //list day month of calendar
    listDayOfMonth(plans) {
        let currentComponent = this;
            var firstDay = plans[0].day;
            var yearMonth = moment(firstDay).format('YYYY-MM');
            var year = moment(firstDay).format('YYYY');
            var month = moment(firstDay).format('MM');
            var endDate = parseInt(moment(firstDay).endOf('month').format('DD'))
            currentComponent.month = month;
            currentComponent.year = year;
            currentComponent.dataDay = [];
            for (var i = 1; i <= endDate; i++) {
                var day = moment(yearMonth + '-' + i).format('YYYY-MM-DD');
                var day_of_week = moment(day).isoWeekday();

                var tmpItem = {
                    day: day,
                    times: [],
                    listTimes: [],
                    day_of_week:day_of_week
                };
                for (let key in plans) {
                    if (tmpItem.day == plans[key].day) {
                        tmpItem.times = plans[key].times;
                        for (var item of plans[key].times) {
                            tmpItem.listTimes.push(item.time);
                        }
                    }
                }
                currentComponent.dataDay.push(tmpItem);
            }
    }

    pushData(i, time) {
        var index = this.dataDay[i].listTimes.indexOf(time);
        if (index < 0) {
            this.dataDay[i].times.push({
                time: time,
                content: ''
            });
            this.dataDay[i].listTimes.push(time);
        }
        else {
            for (var key in this.dataDay[i].times) {
                if (this.dataDay[i].times[key].time == time) {
                    this.dataDay[i].times.splice(key, 1);
                    break;
                }
            }
            this.dataDay[i].listTimes.splice(index, 1)
        }
    }

    planDetail(){
        this.router.navigate(['/'+this.languageName + '/mypage/plan/detail/' + this.plan_id]);
    }

    close_modal(){
        $(document).on('click', '#close_modal', function () {
            $(".modal-dialog").css("display","none");
        });
    }
}

