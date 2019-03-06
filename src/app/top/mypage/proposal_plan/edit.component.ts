import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

@Component({
    selector: 'mypage-proposal-plan-edit',
    templateUrl: './edit.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './edit.component.css',
        '../../../../assets/top/css/themes/default.date.css',

    ]
})
export class EditComponent implements OnInit {
    private plan_id: any;
    private prefectureName: any;
    private detailRequests = {
        'id': '',
        'language_id': '',
        'plan_id': '',
        'request_id': '',
        'date_plan': '',
        'desc': '',
        'name': ''
    };
    private detailSuggestPlan = {
        'id': '',
        'title': '',
        'city_id': '',
        'country_id': '',
        'date_plan': '',
        'time_request': '',
        'guider': '',
        'member_id': '',
        'start_time': '',
        'time_start': [],
        'time_apply': '',
        'price': '',
        'content': '',
        'address_meeting': '',
        'plan_ranking': '',
        'num_people': '',
        'date_actual': ''
    };
    private timeStart = {'time': [{'plan_hour': '00', 'plan_min': '00'}]};
    private listPrefecture;
    private request_id;
    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private currentMember = this.app.getCurrentMember();
    private timeStartError;
    private Error = [];
    private errPeople;
    private people;
    private year_request;
    private month_request;
    private day_request;
    private weekday_request;
    private editData;
    private time_start_back;
    private listCountry;

    private data = {
        'form_confirm': true,
        'member_id': this.app.curMember ? this.app.curMember.id : null,
        'plan_time_start': [],
        'language_id': this.app.getConfig('TOP_LANG_ID'),
        'request_id': '',
        'time_request': '',
        'date_plan': '',
        'proposal_title': '',
        'city_id': '',
        'country_id': '',
        'address_meeting': '',
        'content': '',
        'num_people': '',
        'date_actual':'',
        'status':this.app.constant.PROPOSAL_COLLECTION,
        // 'booking': [],
        'other': '',
        'price': '',
        'price_unit':1,
        'id':'',
        'message_max':'',
    };
    private username;

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.getListCountry();
        this.app.checkDisplayLanguage(this.languageName);
        this.editData = this.app.getConfig('editconfirmProposalPlan');
        if (this.editData && this.app.curMember) {
            this.editData = JSON.parse(this.editData);
            this.time_start_back = JSON.parse(this.editData.formPlan.plan_time_start);
            this.detailRequests = this.editData.request;
            this.detailSuggestPlan = this.editData.formPlan;
            this.request_id = this.detailRequests.request_id;
            this.data.num_people = this.detailSuggestPlan.num_people;
            this.data.proposal_title = this.editData.formPlan.proposal_title;
            this.plan_id = this.editData.formPlan.id;
            if(this.detailRequests.date_plan){
                this.year_request = this.detailRequests.date_plan.slice(0,4);
                this.month_request = this.detailRequests.date_plan.slice(5,7);
                this.day_request = this.detailRequests.date_plan.slice(8,10);
                let d = new Date(this.detailRequests.date_plan.slice(0,10));
                let thu = d.getDay();
                this.weekday_request = this.app.getDayOfWeek(thu);
            }

                var planHourMin = [];
                var minHour;
                $.each(this.time_start_back, function (index, value) {
                    minHour = value.time_start.split(':');
                    planHourMin.push({plan_hour: minHour[0].trim(), plan_min: minHour[1].trim()})
                });
                this.timeStart.time = planHourMin;


            if(this.editData.formPlan.time_request){
                var timeRequest =  this.editData.formPlan.time_request.split(':');
                $('#time_request_hour').val(timeRequest[0]);
                $('#time_request_min').val(timeRequest[1]);
            }
            this.detailSuggestPlan['title'] = this.editData.formPlan.proposal_title;
            $('#plan-message').val(this.editData.message);
            this.getListCityByCountry(this.editData.formPlan.country_id);
            // if(parseInt(this.editData.formPlan.country_id) == this.app.constant.COUNTRY_DEFAULT){
            //     $('#plan-location-pref').show();
            // }else {
            //     $('#plan-location-pref').hide();
            // }

        }else if(this.app.curMember) {
            this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.plan_id = params['id'];
                    this.app.get('mypage/detail_suggest_plan', {plan_id: params['id'], language_id: this.language_id}).then(res => {
                        if (res.status == 200) {
                            this.detailRequests = res.json().data.detailRequests[0];
                            this.username = this.detailRequests.name,
                            this.detailSuggestPlan = res.json().data.detailSuggestPlan;
                            this.data.num_people = this.detailSuggestPlan.num_people;
                            this.request_id = this.detailRequests.request_id;
                            // $('#plan-name').val(this.detailSuggestPlan.proposal_title);
                            if(res.json().data.detailSuggestPlan.country_id){
                                this.getListCityByCountry(res.json().data.detailSuggestPlan.country_id);
                            }
                            this.data.country_id = res.json().data.detailSuggestPlan.country_id;
                            this.data.proposal_title = this.detailSuggestPlan.title;
                            if(res.json().data.detailSuggestPlan.time_request){
                                var timeRequest =  res.json().data.detailSuggestPlan.time_request.split(':');
                                $('#time_request_hour').val(timeRequest[0]);
                                $('#time_request_min').val(timeRequest[1]);
                            }
                            if (this.detailSuggestPlan.time_start) {
                                var planHourMin = [];
                                var minHour;
                                $.each(this.detailSuggestPlan.time_start, function (index, value) {
                                    minHour = value.split(':');
                                    planHourMin.push({plan_hour: minHour[0].trim(), plan_min: minHour[1].trim()})
                                });
                                this.timeStart.time = planHourMin;
                            }
                            if (this.detailSuggestPlan.time_request) {
                                let timeRequest = this.detailSuggestPlan.time_request.slice(0, 2);
                                $('#time-request').val(timeRequest);
                            }
                            // this.listSuggestPlan = res.json().data.listSuggestPlan;


                            if(this.detailRequests.date_plan){
                                this.year_request = this.detailRequests.date_plan.slice(0,4);
                                this.month_request = this.detailRequests.date_plan.slice(5,7);
                                this.day_request = this.detailRequests.date_plan.slice(8,10);
                                let d = new Date(this.detailRequests.date_plan.slice(0,10));
                                let thu = d.getDay();
                                this.weekday_request = this.app.getDayOfWeek(thu);
                            }

                            // if(parseInt(res.json().data.detailSuggestPlan.country_id) == this.app.constant.COUNTRY_DEFAULT){
                            //     $('#plan-location-pref').show();
                            // }else {
                            //     $('#plan-location-pref').hide();
                            // }
                        } else {
                            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                            this.router.navigate([this.app.language]);
                        }
                    });
                }
            });
        }

        this.setTitleAndDescription();
    }
    getListCityByCountry(country_id){
        this.app.get('cities/list_by_country',{'language_id':this.language_id,'country_id': country_id}).then(res => {
            if (res.status == 200) {
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page -  reissue the proposal of the travel request - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page - the apprication screen for the revised travel request proposal. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

    goToF67() {
        // di toi man hinh F67
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

    confirmSave() {
        this.data.id = this.plan_id;
        this.data.date_plan = $('#input-date').val();
        this.data.country_id = $('.country_id').val();
        if($('.prefecture_id').is(':visible') == true){
            this.data.city_id = $('.prefecture_id').val();
        }else {
            this.data.city_id = '';
        }
        this.data.address_meeting = $('#plan-location-address').val();
        this.data.content = $('#plan-detail').val();
        this.data.other = $('#plan-note').val();
        this.data.request_id = this.request_id;
        this.data.date_actual = $('#date-actual').val();
        this.data.status = this.app.constant.PROPOSAL_COLLECTION;
        this.data.message_max = $('#plan-message').val();
        if ($('#plan-price').val() == '') {
            this.data.price = null;
        } else {
            this.data.price = $('#plan-price').val();
        }
        this.data.time_request = $('#time_request_hour').val() +":"+ $('#time_request_min').val();
        this.data.member_id = this.currentMember.id;
        if (this.timeStart.time) {
            var time_start = [];
            $.each(this.timeStart.time, function (index, value) {
                time_start.push({'time_start': value.plan_hour + ':' + value.plan_min});
            });
            this.data.plan_time_start = time_start;
        }
        // var numPeople = [];
        // numPeople.push({'number_people': $('#plan-number').val()});
        // this.data.booking = numPeople;

        this.app.post('save_plan', this.data).then(res => {
            if (res.status == 200) {
                this.app.setConfig('editconfirmProposalPlan', JSON.stringify({
                    formPlan: this.data,
                    request:this.detailRequests,
                    number_people: $('#plan-number').val(),
                    prefectureText:$('.prefecture_id').is(':visible') == true ? $(".prefecture_id option:selected").text() : '',
                    username:this.username,
                    titleRequest:this.detailRequests['title'],
                    message:$('#plan-message').val(),
                    created_at:this.detailSuggestPlan['created_at'],
                    country_name:$('.country_id :selected').text()
                }));
                this.router.navigate([this.languageName + '/mypage/proposal_plan/editconfirmation']);
            } else {
               window.scroll(0,700);
                if(res.json().message){
                    alert(this.app.ttrans('要求の提出期限が切れた'));
                }
                this.Error = res.json();
                this.timeStartError = [];
                for (let i = 0; i < $('.plan-time-start').length; i++) {
                    this.timeStartError.push(res.json()['plan_time_start.' + i + '.time_start']);
                }
            }
        });


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

