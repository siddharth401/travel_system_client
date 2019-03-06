import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';


@Component({
    selector: 'suggest-plan-add',
    templateUrl: './add.component.html',
    styleUrls: [
        '../../../../assets/top/css/suggest.css',
        '../../../../assets/top/css/themes/default.date.css',
        './add.component.css'
    ]
})
export class AddComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getConfig('TOP_LANG');
    private currentMember = this.app.getCurrentMember();
    private request = {};
    private member = {};
    private category = [];
    private inforSuggestPlan;
    private timeStartError;
    private Error = {};
    private checkedError = '';
    private errPeople;
    private listPrefecture;
    private request_id;
    private confirmFormData;
    private selectedPre = '';
    private selectedCountry = '';
    private selectedTime = '';
    private people;
    private city_name;
    private time_request_hour;
    private time_request_min;
    private time_request_required_hour;
    private time_request_required_min;
    private time_request_required;
    private weekday_created;
    private weekday_date_plan;
    private weekday_date_end;
    private listCountry;

    private data = {
        'form_confirm': true,
        'member_id': this.currentMember ? this.currentMember.id : null,
        'plan_time_start': [],
        'language_id': this.app.getConfig('TOP_LANG_ID'),
        'request_id': '',
        'time_request': '',
        'date_plan': '',
        'proposal_title': '',
        'city_id': '',
        'country_id': this.app.constant.TRUE,
        'address_meeting': '',
        // 'booking':[],
        'other': '',
        'content': '',
        'price': '',
        'status': this.app.constant.NEGOTIATION,
    };
    private timeStart = {'time': [{'plan_hour': '00', 'plan_min': '00'}]};
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuthGuider();
        window.scroll(0,0);
        this.app.checkDisplayLanguage(this.languageName);
        if (this.app.getConfig('confirmPlan') && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.confirmFormData = JSON.parse(this.app.getConfig('confirmPlan'));
            this.data = this.confirmFormData.formPlan;
            this.getListCityByCountry(this.confirmFormData.formPlan.country_id);
            this.city_name = this.confirmFormData.city_name;
            this.request = this.confirmFormData.request;
            let time_request = this.confirmFormData.request.time_start.split(':');
            this.time_request_hour = time_request[0];
            this.time_request_min = time_request[1];
            let time_request_required = this.confirmFormData.request.plan_hour.split(':');
            this.time_request_required_hour = time_request_required[0];
            this.time_request_required_min = time_request_required[1];
            this.time_request_required = this.confirmFormData.request.plan_hour;
            this.timeStart = this.confirmFormData.planHourMin;
            this.member = this.confirmFormData.member;
            this.category = this.confirmFormData.category;
            var formatTime = this.data.time_request.slice(0, 2);
            if (formatTime == '10' || formatTime == '20') {
                this.selectedTime = this.data.time_request.slice(0, 2);
            } else {
                if (formatTime.indexOf('0') != -1) {
                    this.selectedTime = this.data.time_request.slice(1, 2);
                } else {
                    this.selectedTime = this.data.time_request.slice(0, 2);
                }
            }
            this.request_id = this.data.request_id;
            this.selectedPre = this.data.city_id;
            this.selectedCountry = this.data.country_id;
            // if(parseInt(this.data.country_id) == this.app.constant.COUNTRY_DEFAULT){
            //     $('#plan-location-pref').show();
            // }else {
            //     $('#plan-location-pref').hide();
            // }
            $('#time_request_hour').val(this.confirmFormData.time_request_hour);
            $('#time_request_min').val(this.confirmFormData.time_request_min);
            $('#plan-name').val(this.data.proposal_title);
            // $('#plan-number').val(this.confirmFormData.number_people);
            $('#input-date').val(this.data.date_plan);
            $('#plan-location-address').val(this.data.address_meeting);
            $('.content-ta-plan').val(this.data.content);
            $('.other-ta-plan').val(this.data.other);
            $('#plan-price').val(this.data.price);
            $('#plan-total').val(parseInt(this.data.price) * parseInt(this.confirmFormData.people));
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
            this.route.params.subscribe((params) => {
                if (params['request_id']) {
                    this.request_id = params['request_id'];
                    this.app.get('info_suggest_plan', {
                        request_id: params['request_id'],
                        language_id: this.language_id
                    }).then(res => {
                        if (res.status == 200) {
                            this.inforSuggestPlan = res.json().data;
                            this.request = res.json().data;
                            if(res.json().data.city.name){
                                this.city_name = res.json().data.city.name;
                            }
                            this.getListCityByCountry(res.json().data.country_id);
                            this.data.country_id = res.json().data.country_id;

                            this.people = res.json().data.num_people;
                            this.member = res.json().data.members;
                            this.category = res.json().data.categories;
                            if(res.json().data.time_start){
                                var planHourMin = [];
                                var minHour;
                                    minHour = res.json().data.time_start.split(':');
                                    planHourMin.push({plan_hour: minHour[0].trim(), plan_min: minHour[1].trim()})
                                this.timeStart.time = planHourMin;
                            }
                            if(res.json().data.plan_hour < 10){
                               $('#time_request_hour').val('0'+res.json().data.plan_hour);
                            }else {
                                $('#time_request_hour').val(res.json().data.plan_hour);
                            }
                            $('.prefecture_id').val(res.json().data.city_id);
                            $('.country_id').val(res.json().data.country_id);
                            this.selectedPre = res.json().data.city_id;
                            let time_request = res.json().data.time_start.split(':');
                            this.time_request_hour = time_request[0];
                            this.time_request_min = time_request[1];
                            let time_request_required = res.json().data.plan_hour.split(':');
                            this.time_request_required_hour = time_request_required[0];
                            this.time_request_required_min = time_request_required[1];
                            this.time_request_required = res.json().data.plan_hour;
                            $('.plan_time_hour_required_request').val(time_request_required[0]);
                            $('.plan_time_required_request').val(time_request_required[1]);

                            if(res.json().data.created_at){
                                let d = new Date(res.json().data.created_at.slice(0,10));
                                let thu = d.getDay();
                                this.weekday_created = this.app.getDayOfWeek(thu);
                            }
                            if(res.json().data.date_plan){
                                let d = new Date(res.json().data.date_plan.slice(0,10));
                                let thu = d.getDay();
                                this.weekday_date_plan = this.app.getDayOfWeek(thu);
                            }
                            if(res.json().data.date_end){
                                let d = new Date(res.json().data.date_end.slice(0,10));
                                let thu = d.getDay();
                                this.weekday_date_end = this.app.getDayOfWeek(thu);
                            }
                            // if(parseInt(res.json().data.country_id) == this.app.constant.COUNTRY_DEFAULT){
                            //     $('#plan-location-pref').show();
                            // }else {
                            //     $('#plan-location-pref').hide();
                            // }
                        }
                    });
                }
            });
        }
        this.setTitleAndDescription();
        this.getListCountry();

    }

    getListCityByCountry(country_id) {
        this.app.get('cities/list_by_country',{'language_id':this.language_id,'country_id': country_id}).then(res => {
            if (res.status === 200) {
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    addTime() {
        this.timeStart.time.push({'plan_hour': '00', 'plan_min': '00'});
    }

    removeTime(index = 0) {
        this.timeStart.time.splice(index, 1);
    }

    onKey(event: any) {
        $('#plan-total').val(event.target.value * parseInt($('#plan-number').val()));
    }
    numPeople(event: any) {
        $('#plan-total').attr("value", event.target.value * parseInt($('#plan-price').val()));
    }

    confirmData() {
        this.data.proposal_title = $('#plan-name').val();
        this.data.date_plan = $('#input-date').val();
        if($('.prefecture_id').is(':visible') == true){
            this.data.city_id = $('.prefecture_id').val();
        }else {
            this.data.city_id = '';
        }
        this.data.address_meeting = $('#plan-location-address').val();
        this.data.content = $('.content-ta-plan').val();
        this.data.other = $('.other-ta-plan').val();
        this.data.request_id = this.request_id;
        if ($('#plan-price').val() == '') {
            this.data.price = null;
        } else {
            this.data.price = $('#plan-price').val().trim();
        }
        this.data.time_request = $('#time_request_hour').val() +":"+ $('#time_request_min').val();

        if (this.timeStart.time) {
            var time_start = [];
            $.each(this.timeStart.time, function (index, value) {
                time_start.push({'time_start': value.plan_hour + ':' + value.plan_min});
            });
            this.data.plan_time_start = time_start;
        }
        if ($('#check-privacy:checkbox:checked').length == 1) {
            this.checkedError = '';
            this.app.post('save_plan', this.data).then(res => {
                if (res.status == 200) {
                    this.app.setConfig('confirmPlan', JSON.stringify({
                        formPlan: this.data,
                        planHourMin: this.timeStart,
                        request: this.request,
                        title_request:this.request['title'],
                        member: this.member,
                        category: this.category,
                        number_people:$('#plan-number').val(),
                        time_request_hour:$('#time_request_hour').val(),
                        time_request_min:$('#time_request_min').val(),
                        people:$('#plan-number').val(),
                        city_name:this.city_name,
                        country_name:$('.country_id :selected').text(),
                        prefecture_name:$('.prefecture_id :selected').text(),
                }));
                    this.router.navigate([this.languageName + '/suggestion/plan/confirmation']);
                } else {
                    window.scroll(0,700);
                    if(res.json().message){
                        alert(this.app.ttrans('要求の提出期限が切れた'));
                    }
                    if(res.json()['booking.0.number_people']){
                        this.errPeople = res.json()['booking.0.number_people'][0];
                    }
                    this.Error = res.json();
                    this.timeStartError = [];
                    for (let i = 0; i < $('.plan-time-start').length; i++) {
                        this.timeStartError.push(res.json()['plan_time_start.' + i + '.time_start']);
                    }
                }
            });
        }else {
            this.checkedError = 'Please check the box I agree with the guide agreement and prepare a suggestion plan.';
        }

    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("Creating the travel request proposal following traveler's requests - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans("The screen of  creating the travel request proposal following traveler's requests. 'MATCHING GUIDE' is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.")}
        ]);
    }

    getListCountry(){
        this.app.get('countries/list_by_language',{'language_id':this.language_id}).then(res=>{
            if(res.status == 200){
                this.listCountry = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }
    // changeCountry(){
    //     let country_id = $('.country_id').val();
    //     if(parseInt(country_id) == this.app.constant.COUNTRY_DEFAULT){
    //         $('#plan-location-pref').show();
    //     }else {
    //         $('#plan-location-pref').hide();
    //     }
    // }

}

