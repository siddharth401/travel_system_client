import {Component, OnInit, OnDestroy} from '@angular/core';
import {AppService} from "../../shared/app.service";
import {ActivatedRoute, Params, Router} from '@angular/router';
import {constant} from "../../shared/constant"
import * as moment from 'moment';

declare var $: any;
require('style-loader!bootstrap-year-calendar/css/bootstrap-year-calendar.css');

@Component({
    selector: 'calendar',
    templateUrl: './setting.component.html',
    styleUrls: ['../../../../node_modules/bootstrap-year-calendar/css/bootstrap-year-calendar.min.css',
        './setting.component.css']
})

export class SettingComponent implements OnInit {
    private setting = {};
    private days = [];
    public plans = {proposal_title: '', member_id: '', id: '', plan_time_start:[], plan_languages: [{language_id: ''}]};
    private listGuide = {};
    private listTimeBooking = {};
    public month;
    public year;
    public plans_id;
    public lang_id;
    public currentDay = moment().format('Y-MM-DD');
    public d;
    arr = Array;

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    render(days) {
        var currentComponent = this;
        $(function () {
            $('#calendar').calendar({
                customDayRenderer: function (element, date) {
                    $(element).attr('data-date', date.getTime());
                },

                renderEnd: function (e) {
                    drawDate(e.currentYear);
                    currentComponent.setting['year'] = e.currentYear;
                    currentComponent.setting['timeStamp'] = e.timeStamp;
                    $("#calendar").find(".month").each(function () {
                        if(moment($(this).find('.day-content').first().data('date')).format('Y-MM') >= moment().format('Y-MM'))
                        {
                            $(this).find(".month-title").css({'color': 'rgb(0, 160, 233)','text-decoration' : 'underline'}).addClass('enable-month');
                        }
                    })

                },
            });

            function drawDate(currentYear) {
                if (days.length > 0) {
                    for (var day of days) {
                        var current_date = new Date(day.date + ' 00:00:00').getTime();
                        $("#calendar").find("[data-date='" + current_date + "']").first().css('background-color', 'rgb(0, 160, 233)');
                    }
                }
            }
        });
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params['id'] && params['language_id']) {
                this.plans_id = params['id'];
                this.lang_id = params['language_id'];
                this.getDateCalendar();
            }
        });
        this.getListGuide();
        this.getListTimeStartBooking();
    }

    //list day month of calendar
    listDayOfMonth(plans) {
        $(document).on('click', '#btn_cancel', function () {
            $('#plan_time').hide();
            $('#plan_calender').show();
        });
        let currentComponent = this;
        $(document).on('click', '.enable-month', function () {

            $('#plan_calender').hide();
            $('#plan_time').show();
            var firstDay = moment(parseInt($(this).parents('.month').find('.day-content').first().data('date'))).format('YYYY-MM-DD');
            var yearMonth = moment(firstDay).format('YYYY-MM');
            var year = moment(firstDay).format('YYYY');
            var month = moment(firstDay).format('MM');
            var endDate = parseInt(moment(firstDay).endOf('month').format('DD'));
            currentComponent.month = month;
            currentComponent.year = year;
            currentComponent.days = [];
            for (var i = 1; i <= endDate; i++) {
                var day = moment(yearMonth + '-' + i).format('YYYY-MM-DD');
                var day_of_week = moment(day).isoWeekday();

                var tmpItem = {
                    date: day,
                    times: [],
                    listTimes: [],
                    day_of_week:day_of_week
                };
                for (let key in plans.days) {
                    if (tmpItem.date == plans.days[key].date) {
                        tmpItem.times = plans.days[key].times;
                        for (var item of plans.days[key].times) {
                            tmpItem.listTimes.push(item.time);
                        }
                    }
                }
                currentComponent.days.push(tmpItem);
            }
        })
    }

    save() {
        this.app.post('plans/save_calendar', {
            days: this.days,
            month: this.month,
            year: this.year,
            id: this.plans.id
        }).then(res => {
            if (res.status === 200) {
                this.app.adminFlashSuccess(this.app.trans('Data has been saved'));
                $('#plan_time').hide();
                $('#plan_calender').show();
                this.getDateCalendar();
                window.location.replace(this.app.constant.BASE_WEB+"admin/plan/form/"+this.plans_id+"/"+this.lang_id+"/calander");
            }else {
            }
        });
    }

    //list guide
    getListGuide() {
        this.app.get('members', {'active': 1, 'type': 2}).then(res => {
            if (res.status === 200) {
                this.listGuide = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    pushData(i, time) {
        var index = this.days[i].listTimes.indexOf(time);
        if (index < 0) {
            this.days[i].times.push({
                time: time,
                content: ''
            });
            this.days[i].listTimes.push(time);
        }
        else {
            for (var key in this.days[i].times) {
                if (this.days[i].times[key].time == time) {
                    this.days[i].times.splice(key, 1);
                    break;
                }
            }
            this.days[i].listTimes.splice(index, 1)
        }



    }

    //list time start booking
    getListTimeStartBooking(){
        this.app.get('plans/get_date_booking', {id: this.plans_id}).then(res => {
            if (res.status === 200) {
                this.listTimeBooking = res.json().data;
            }
        });
    }

    //get date calendar
    getDateCalendar(){
        this.app.get('plans/detail', {id: this.plans_id, language_id: this.lang_id}).then(res => {
            if (res.status == 200) {
                this.plans = res.json().data;
                this.listDayOfMonth(this.plans);
                System.import('script-loader!bootstrap-year-calendar/js/bootstrap-year-calendar.min.js').then(() => {
                    this.render(this.plans['days'])
                })
            }
        });
    }
}
