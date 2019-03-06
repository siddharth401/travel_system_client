import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";
import {isArray} from "util";

@Component({
    selector: 'reservation-register',
    templateUrl: './register.component.html',
    styleUrls:[
        './register.component.css'
    ]
})
export class RegisterComponent implements OnInit {
    /*private detail_plan = {time_start: [], id: 1, array_people: {}, min_people: '', max_people: '', prefecture_id: '', title: '', member: {introduce: ''}, price: 1, price_unit: '', plan_id: 1, guiders: {id: 1}};*/
    private detail_plan;
    private data = { 'booking': [],
                     'member': [], form_confirm: false, form_complete: false, is_agree_conditions: false };
    private paramsDetailPlan = {
        language_id: 1,
        plan_id: 1,
        member_id: 1
    };
    private booking = {address_meeting: '', country: {}, city: {}, date: '', hour: '', title: '', member_id: 1, number_people: 0, amount: 0, amount_unit: '', language_id: 1, plan_id: 1, request_guider: '', country_id: 1, prefecture_id: ''};
    private member = {name: '', address: '',languages: [],introduce:'', prefecture_id : '', country_id : 1, country_num: '', phone_code: '', gender: 1, phone: '', mail_magazine_option: 1, is_update_profile: 1, customer_email: ''};
    private listPrefecture;
    private error = {};
    private languageError = [];
    private country_num;
    private phone;
    private isDisabled = false;
    private listLanguage;
    private languages = {'languages': [{'language_id': ''}]};
    private language = this.app.getCurrentLanguage();
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private paramsGetTimeHour = {date: '', plan_id: 1, language_id: this.language_id};
    private time_start;
    private msg_warning;
    private listCountry;
    private availableDates = [];
    private is_send_mail = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.app.checkDisplayLanguage(this.app.language);
        this.setTitleAndDescription();
        this.getDetailPlan();
        this.getListCountry();
        this.getListPrefectures();
        this.getListLanguage();
    }

    setTitleAndDescription() {
        $(".page-content__title").html(this.app.ttrans("旅プラン予約申請"));
        this.app.setTitle(this.app.ttrans("旅プラン予約入力　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('旅ガイド作成の旅プランの予約入力画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getTimeHour(date, id) {
        this.paramsGetTimeHour.date = date;
        this.paramsGetTimeHour.plan_id = id;
        this.app.get('mypage/plan/hours', this.paramsGetTimeHour).then(res =>
        {
            if (res.status == 200) {
                if(res.json() && (!isArray(res.json()) || res.json().length > 0)) {
                    this.time_start = $.map(res.json(), function(value, index) {
                        return [value];
                    });
                } else {
                    if(this.app.top_lang_id == this.app.constant.JA_LANGUAGE_ID) {
                        $("#warning-booking-time").html('本日の旅プランがは在庫がございませんので、他の日付を選択してください。');
                    } else {
                        $("#warning-booking-time").html('The travel plan today is sell out, so please select another date.');
                    }
                }
            }
        });
    }

    showCalendar(availableDates = null) {
        let url = this.app.constant.BASE_API+"mypage/plan/hours";
        let top_token = this.app.getConfig('TOP_TOKEN');
        let language_id = this.language_id;
        let plan_id = this.detail_plan.id;
        let top_lang_id = this.app.top_lang_id;
        let ja_lang_id = this.app.constant.JA_LANGUAGE_ID;
        if(top_lang_id == this.app.constant.JA_LANGUAGE_ID) {
            var today = "今日";
            var clear = "クリア";
            var close = "閉じる";
            var labelMonthNext = "次月";
            var labelMonthPrev = "前月";
            var monthsFull = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            var weekdaysShort = ['日', '月', '火', '水', '木', '金', '土'];
            var input_time_str = "時間を選択してください";
        } else {
            var today = "Today";
            var clear = "Clear";
            var close = "Close";
            var labelMonthNext = "next";
            var labelMonthPrev = "prev";
            var monthsFull = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Sep', 'Dec'];
            var weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var input_time_str = "Please select time";
        }



        System.import('script-loader!assets/top/js/picker.js').then(()=> {
            System.import('script-loader!assets/top/js/picker.date.js').then(()=> {
                $(document).ready(function () {
                    //今日の日付を取得してカレンダーに設定
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();

                    // An array of dates enabled on dateapick
                    var dates = [];
                    if(availableDates && availableDates != []) {
                        dates.push(true);
                        $.each(availableDates, function( index, value ) {
                            let arrDay = value.split("-");
                            dates.push([arrDay[0],arrDay[1]-1,arrDay[2]]);
                        });
                    }

                    $("#booking-date").pickadate({
                        monthsFull: monthsFull,
                        weekdaysShort: weekdaysShort,
                        today: today,
                        clear: clear,
                        close: close,
                        labelMonthNext: labelMonthNext,
                        labelMonthPrev: labelMonthPrev,
                        format: 'yyyy/mm/dd',
                        min: [year, month, day],
                        onClose: function() {
                            $(document.activeElement).blur();
                            $('.loadingRequest').hide();
                        },
                        onSet: function() {
                            $('.loadingRequest').show();
                            let date = this.get('select', 'yyyy-mm-dd');
                            $(".booking-input-time").get(0).options.length = 0;
                            $(".booking-input-time").get(0).options[0] = new Option(input_time_str, "");
                            if(date) {
                                $.ajax({
                                    type: 'GET',
                                    url: url,
                                    data: { plan_id: plan_id, date : this.get('select', 'yyyy-mm-dd'), top_token: top_token, language_id: language_id },
                                    success: function(res) {
                                        let time_start = [];
                                        time_start = $.map(res, function(value, index) {
                                            return [value];
                                        });

                                        if(time_start.length > 0) {
                                            $.each(time_start, function(index, item) {
                                                $(".booking-input-time").get(0).options[$(".booking-input-time").get(0).options.length] = new Option(item, item);
                                            });
                                            $("#warning-booking-time").css("display", "none");
                                            $("#warning-booking-time").html("");
                                        } else {
                                            $("#warning-booking-time").css("display", "block");
                                            if(top_lang_id == ja_lang_id) {
                                                $("#warning-booking-time").html('本日の旅プランがは在庫がございませんので、他の日付を選択してください。');
                                            } else {
                                                $("#warning-booking-time").html('The travel plan today is sell out, so please select another date.');
                                            }
                                        }
                                        $('.loadingRequest').hide();

                                    },
                                    error: function(error){
                                        $('.loadingRequest').hide();
                                        alert("Please logout then booking again!");
                                    }
                                });
                            }
                        },
                        disable: dates
                    });
                });
            });
        });
    }

    getConfigDataBooking(plan_id) {
        if(this.app.getConfig('confirmBooking')) {
            let confirmBooking = this.app.getConfig('confirmBooking');
            let booking = JSON.parse(confirmBooking);
            if(plan_id == booking.booking.plan_id) {
                this.booking.date = booking.booking.date;
                this.booking.hour = booking.booking.hour;
                this.booking.number_people = booking.booking.number_people;
                this.booking.request_guider = booking.booking.request_guider;
                this.member.name = booking.member.name;
                this.member.phone = booking.member.phone;
                this.member.address = booking.member.address;
                this.member.customer_email = booking.member.customer_email;
                this.member.is_update_profile = booking.member.is_update_profile;
                this.member.country_id = booking.member.country_id;
                this.member.prefecture_id = booking.member.prefecture_id;
                this.member.phone_code = booking.member.phone_code;
                this.member.languages = booking.member.languages;
                this.member.mail_magazine_option = booking.member.mail_magazine_option;
                this.member.gender = booking.member.gender;
            }
        }
    }

    getDetailPlan() {
        if(this.app.getConfig('GUIDER_PLAN_DATE')){
            this.booking.date = this.app.datex(this.app.getConfig('GUIDER_PLAN_DATE'), 'YYYY/MM/DD');

        }
        let top_lang_id = this.app.getConfig('TOP_LANG_ID');
        this.paramsDetailPlan.language_id = top_lang_id;
        this.paramsDetailPlan.plan_id = this.route.snapshot.paramMap.get('id') ? parseInt(this.route.snapshot.paramMap.get('id')) : 1;
        let curMember = this.app.getCurrentMember();
        this.paramsDetailPlan.member_id = curMember.id;

        this.app.get('detail_plan', this.paramsDetailPlan).then(res =>
        {
            if (res.status == 200) {
                this.detail_plan = res.json().data;
                this.detail_plan.array_people = this.getArrayNumberPeople(this.detail_plan.min_people, this.detail_plan.max_people);
                this.member = res.json().data.member;
                this.member.gender = this.member.gender ? this.member.gender : this.app.constant.Male;
                this.getConfigDataBooking(this.detail_plan.id);
                this.member.prefecture_id = this.detail_plan.member.prefecture_id ? this.detail_plan.member.prefecture_id : '';
                //languages
                this.languages.languages = this.member.languages;
                if (this.languages.languages.length < 1) {
                    this.addLanguage();
                }
                //separate country number and phone number
                if(res.json().data.member && res.json().data.member.phone) {
                    /*this.phone = this.app.convertPhoneNumber(this.member.phone);*/
                    this.phone = this.member.phone;
                }
                //get list days enabled on plan for booking
                if(res.json().data.calendars && res.json().data.calendars.length > 0) {
                    for(var i = 0; i < res.json().data.calendars.length; i++){
                        this.availableDates.push(res.json().data.calendars[i].date);
                    }
                }
                //get time hour for first time booking
                if(this.booking.date) {
                    this.getTimeHour(this.booking.date, this.detail_plan.id);
                } else {
                    /*if(this.app.top_lang_id == this.app.constant.JA_LANGUAGE_ID) {
                        $( document ).ready(function() {
                            $("#warning-booking-time").html('本日の旅プランがは在庫がございませんので、他の日付を選択してください。');
                        });
                    } else {
                        $( document ).ready(function() {
                            $("#warning-booking-time").html('The travel plan today is sell out, so please select another date.');
                        });
                    }*/
                }

            } else if (res.status == 401) {
                alert(this.app.ttrans('自分の旅プランを予約できません。'));
                this.router.navigate([this.language]);
            }
        });

    }
    
    confirmData(is_confirm) {
        window.scroll(0,0);
        this.isDisabled = true;
        this.booking.date = $("#booking-date").val();
        this.booking.title = this.detail_plan.title;
        this.member.introduce = this.detail_plan.member.introduce;
        this.member.phone = $('#user-tel').val();
        /*this.member.phone = this.member.phone.replace(/-/g, "");*/
        this.member.phone_code = $('#phone_code').val();
        this.member.mail_magazine_option = $('#user-magazine-01').is(':checked') == true ? this.app.constant.Send : this.app.constant.Not_Send;
        //is update profile
        this.member.is_update_profile = $('#update-profile').is(':checked') == true ? this.app.constant.TRUE : this.app.constant.FALSE;
        //set prefecture is empty if country is different japan
        this.member.prefecture_id = this.member.country_id == this.app.constant.COUNTRY_DEFAULT ? this.member.prefecture_id : '';
        this.booking.country_id = this.member.country_id;
        this.booking.prefecture_id = this.member.country_id == this.app.constant.COUNTRY_DEFAULT ? this.member.prefecture_id : '';
        let curMember = this.app.getCurrentMember();
        this.booking.member_id = curMember.id;
        //languages
        if (this.languages.languages) {
            var languages = [];
            $.each(this.languages.languages, function (index, value) {
                languages.push({'language_id': value.language_id});
            });
            this.member.languages = languages;
        }
        this.booking.address_meeting = this.detail_plan.address_meeting;
        this.booking.amount = this.detail_plan.price*this.booking.number_people ? this.detail_plan.price*this.booking.number_people : 0;
        this.booking.amount_unit = this.detail_plan.price_unit ? this.detail_plan.price_unit : this.app.constant.CURRENCY_UNIT_DEFAULT;
        this.booking.plan_id = this.detail_plan.plan_id;
        this.booking.language_id = this.app.getConfig('TOP_LANG_ID');
        this.data.booking.push(this.booking);
        this.data.member.push(this.member);
        this.data.form_confirm = is_confirm;
        this.data.is_agree_conditions = $('#check-privacy').is(':checked') == true ? this.app.constant.IS_AGREE_CONDITIONS : this.app.constant.NOT_AGREE_CONDITIONS;
        this.app.post('save_booking', this.data).then(res => {
            if (res.status === 200) {
                if(this.app.getConfig('GUIDER_PLAN_DATE')){
                    this.app.delConfig('GUIDER_PLAN_DATE');
                }
                let is_update_profile = $('#update-profile').is(':checked') == true ? this.app.constant.TRUE : this.app.constant.FALSE;
                this.app.setConfig('confirmBooking', JSON.stringify({
                    booking:this.booking,
                    member:this.member,
                    country:this.detail_plan.country,
                    city:this.detail_plan.city,
                    guider:res.json().guider_info,
                    is_update_profile:is_update_profile
                }));
                this.app.setConfig('bookingId', res.json().booking_id);
                this.router.navigate([this.app.language+'/reservation/'+this.detail_plan.plan_id+'/confirmation']);
            } else {
                $('.general-error-msg').fadeIn();
                this.isDisabled = false;
                this.data.booking = [];
                this.data.member = [];
                this.error = res.json();
                this.languageError = [];
                for (let i = 0; i < $('.language_id').length; i++) {
                    this.languageError.push(res.json()['member.0.languages.' + i + '.language_id']);
                }
                if(res.json().is_agree_conditions) {
                    window.scrollTo(0, 2700);
                } else {
                    window.scrollTo(0,400);
                }
            }
        });
    }

    addLanguage() {
        this.languages.languages.push({'language_id': ''});
    }

    removeLanguage(index = 0) {
        this.languages.languages.splice(index, 1);
    }

    getArrayNumberPeople(min_people, max_people) {
        let min = parseInt(min_people) ? parseInt(min_people) : 1;
        let max = parseInt(max_people) ? parseInt(max_people) : 5;
        let arrayPeople = [];
        for(var i = min; i <= max; i++){
            arrayPeople.push(i);
        }
        return arrayPeople;
    }

    getListCountry(){
        this.app.get('countries/frontend_lists', {'type': this.app.constant.COUNTRY_IS_PROFILE, 'language_id': this.language_id}).then(res =>
        {
            if (res.status == 200) {
                this.listCountry = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }

    getListPrefectures() {
        this.app.get('prefectures/frontend_lists', {'language_id':this.language_id}).then(res => {
            if (res.status === 200) {
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }

    getListLanguage(){
        this.app.get('languages',{'active':1, 'is_support': 1}).then(res=>{
            if(res.status == 200){
                this.listLanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }

}
