import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';



@Component({
    selector: 'suggest-plan-detail',
    templateUrl: './reservation.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        'reservation.component.css'
    ]
})
export class ReservationComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.language;
    private listlanguage:any;
    private listCountry:any;
    private listPrefecture:any;
    private confirmFormData;
    private detailSuggestPlan;
    private selectedPrefecture;
    private selectedCountry;
    private Error = {};
    private plan_suggest;
    private request_id;
    private guider = {};
    private members = {};
    private formMember = {};
    private Selected = [];
    private num_people;
    private request;
    private checkedError;
    private year;
    private month;
    private day;
    private weekday;
    private time_request_hour;
    private time_request_min;
    private time_start = [];
    private inforUser = this.app.getCurrentMember();
    private countryName;
    private member_name = '';
    private member_phone = '';
    private member_customer_email = '';
    private member_email = '';
    private member_address = '';
    private selectPhone = '';

    private languageError = [];
    private data = {
        'form_confirm': true,
        'is_agree_conditions': true,
        'member_languages': [],
        'booking':[],
        'member':[],
    };
    private Languages = {'language': [{'language_id': ''}]};
    private booking = {'plan_id': '','language_id':'','amount':'','name':'','gender':'', 'date': '','introduction':'','hour':'', 'address': '', 'member_id': '', 'number_people': '', 'date_actual': '', 'status': '','amount_unit':1,'phone':'','phone_code':'','email':'','mail_magazine_option':''};
    private member = {'id':'',languages: [],'name':'','gender':'','phone':'','phone_code':'','email':'','country_id':'1','prefecture_id':'','address':'','mail_magazine_option':'','is_update_profile': 1, 'customer_email': ''};
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        if(this.language_id == 1){
            this.countryName = '日本';
        }else {
            this.countryName = 'Japan';
        }
        this.getListLanguage();
        this.getListCountry();
        this.getListPrefecture();
        this.setTitleAndDescription();
        this.app.checkDisplayLanguage(this.languageName);
        if(this.app.getConfig('detailSuggestPlan') && this.app.curMember){
            this.detailSuggestPlan = JSON.parse(this.app.getConfig('detailSuggestPlan'));
            this.plan_suggest = this.detailSuggestPlan.plan_suggest;
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
            this.request_id = this.detailSuggestPlan.request_id;
            this.request = this.detailSuggestPlan.request;
            this.num_people = this.detailSuggestPlan.request_num_people;
            this.guider = this.detailSuggestPlan.guider;
            this.members = this.detailSuggestPlan.member;
            this.booking.plan_id =  this.plan_suggest['id'];
            this.booking.language_id =  this.language_id;;
            this.booking.address =  this.plan_suggest['address_meeting'];
            this.booking.member_id =  this.plan_suggest['member_id'];
            this.booking.number_people =  this.request['num_people'];
            this.booking.introduction = this.plan_suggest['booking_introduction']
            var datetime = this.plan_suggest['time_request'].split(":");
            this.booking.date = this.plan_suggest['date_plan'].slice(0,10);
            this.booking.hour = this.plan_suggest['time_start'][0];
            this.booking.amount = (this.plan_suggest['price'] * this.num_people).toString();
            this.booking.name =  this.plan_suggest['proposal_title'];
            this.booking.date_actual =  this.plan_suggest['date_actual'];
            this.booking.status =  this.app.constant.PROCESSING;
            this.member.id = this.members['id'];

            if (this.app.getConfig('confirmReservation')) {
                this.confirmFormData = JSON.parse(this.app.getConfig('confirmReservation'));
                this.data = this.confirmFormData.formReservation;
                this.formMember = this.confirmFormData.formMember;
                this.Languages.language = this.confirmFormData.multiplelanguage.language;
                if(this.formMember['prefecture_id'] == ''){
                    $('#plan-pref').hide();
                }else {
                    $('#plan-pref').show();
                }
                this.selectedPrefecture = this.formMember['prefecture_id'];
                this.selectedCountry = this.formMember['country_id'];
                if(this.formMember['gender'] == '1'){
                    $('#user-gender-01').attr("checked", "checked");
                }else {
                    $('#user-gender-02').attr("checked", "checked");
                }
                if(this.formMember['mail_magazine_option'] == '1'){
                    $('#user-magazine-01').attr("checked", "checked");
                }else {
                    $('#user-magazine-02').attr("checked", "checked");
                }
                if(this.formMember['is_update_profile'] == '1'){
                    $("#update-profile").prop( "checked", true );
                }else {
                    $("#update-profile").prop( "checked", false );
                }
                this.member_name = this.confirmFormData.formMember.name;
                this.member_phone = this.confirmFormData.formMember.phone;
                this.member_address = this.confirmFormData.formMember.address;
                this.member_email = this.confirmFormData.formMember.email;
                this.member_customer_email = this.confirmFormData.formMember.customer_email;
                this.selectPhone = this.confirmFormData.formMember.phone_code;
                $('#user-contry-num').val(this.confirmFormData.phone_num);
            }else {
                this.app.get('mypage/profile', {member_id:this.inforUser.id,language_id:this.language_id}).then(res => {
                    if (res.status == 200) {
                        this.inforUser = res.json().data;
                        $('#user-name').val(this.inforUser.name);
                        if(res.json().data.languages.length > 0){
                            this.Languages.language = res.json().data.languages;
                        }
                        if(this.inforUser.phone){
                            $('#user-tel').val(this.inforUser.phone);
                        }
                        $('#user-mail').val(this.inforUser.email);
                        this.member_email = this.inforUser.email;
                        this.member_address = this.inforUser.address;
                        this.selectedCountry = this.inforUser.country_id;
                        this.selectPhone = this.inforUser.phone_code;
                        $('.prefecture_id').val(this.inforUser.prefecture_id);
                        this.selectedPrefecture = this.inforUser.prefecture_id;
                        $('#plan-address').val(this.inforUser.address);
                        if(this.inforUser.gender == 2){
                            $("#user-gender-02").attr('checked', true);
                        }else {
                            $("#user-gender-01").attr('checked', true);
                        }
                        if(this.inforUser.country_id == this.app.constant.JA_LANGUAGE_ID){
                            $('#plan-pref').show();
                        }else {
                            $('#plan-pref').hide();
                        }
                    }
                });
                this.getListLanguage();
                this.getListCountry();
                this.getListPrefecture();
            }
        } else if(this.app.curMember) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.app.language]);
        }

    }
    getListLanguage(){
        this.app.get('languages',{'active':1,'is_support':this.app.constant.TRUE}).then(res=>{
           if(res.status == 200){
               this.listlanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
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
    getListPrefecture(){
        this.app.get('prefectures/list_by_language',{'language_id':this.language_id}).then(res=>{
            if(res.status == 200){
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }
    addLanguage() {
        this.Languages.language.push({'language_id': ''});
    }

    removeLanguage(index = 0) {
        this.Languages.language.splice(index, 1);
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - Reservation at the proposal of  the travel request - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page -the reservation screen for the travel request proposal. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

    confirmSave(){
        if($('#user-gender-01').is(':checked') == true){
            this.member.gender = this.app.constant.Male;
            this.booking.gender = this.app.constant.Male;
        }else {
            this.member.gender = this.app.constant.Female;
            this.booking.gender = this.app.constant.Female;
        }
        if($('#user-magazine-01').is(':checked') == true){
            this.member.mail_magazine_option = this.app.constant.Send;
            this.booking.mail_magazine_option = this.app.constant.Send;
        }else {
            this.member.mail_magazine_option = this.app.constant.Not_Send;
            this.booking.mail_magazine_option = this.app.constant.Not_Send;
        }
        this.member.name = $('#user-name').val();
        // this.data.phone = $('#profile-tel').val();
        this.member.phone_code = $('#user-contry-num').val();
        this.member.phone = $('#user-tel').val();
        this.booking.phone_code = $('#user-contry-num').val();
        this.booking.phone = $('#user-tel').val();
        this.booking.email = $('#customer-email').val();


        // this.member.phone = $('#user-contry-num').val() + $('#user-tel').val();
        if($('#user-contory').val() == this.app.constant.TRUE){
            this.member.prefecture_id = $('.prefecture_id').val();
        }

        this.member.country_id = $('.country_id').val();
        this.member.address = $('#plan-address').val();
        this.member.email = $('#user-mail').val();
        this.member.customer_email = $('#customer-email').val();

        if (this.Languages.language) {
            var languages = [];
            $.each(this.Languages.language, function (index, value) {
                languages.push({'language_id': value.language_id});
            });
            this.member.languages = languages;
        }
        var booking = [];
        var member = [];
        booking.push(this.booking);
        member.push(this.member);
        this.data.booking = booking;
        this.data.member = member;

        //is update profile
        if($('#update-profile').is(':checked') == true){
            this.member.is_update_profile = this.app.constant.TRUE;
        }else {
            this.member.is_update_profile = this.app.constant.FALSE;
        }

        if($('#check-privacy:checkbox:checked').length == 1){
            this.checkedError = '';
            this.app.post('mypage/suggestion/reservation', this.data).then(res => {
                if (res.status == 200) {
                    this.app.setConfig('confirmReservation', JSON.stringify({
                        formReservation: this.data,
                        listPrefecture:this.listPrefecture,
                        listLanguage:this.listlanguage,
                        formMember:this.member,
                        multiplelanguage:this.Languages,
                        phone_num:$('#user-contry-num').val(),
                        phone_tel:$('#user-tel').val(),
                        country_name:this.listCountry[$('.country_id').val()],
                        booking_id:res.json().booking_id
                    }));
                    this.app.setConfig('teian_plan_booking',res.json().booking_id);
                    this.router.navigate([this.languageName + '/mypage/suggestion/reservation/confirmation']);
                } else {
                    window.scroll(0,1200);
                    this.Error = res.json();
                    this.languageError = [];
                    for (let i = 0; i < $('.language_id').length; i++) {
                        this.languageError.push(res.json()['member.0.languages.'+i+'.language_id']);
                    }
                    if(res.json().message){
                        alert(this.app.ttrans(res.json().message));
                    }
                }
            });
        }else {
            this.checkedError = 'Please check the box I agree with the guide agreement and prepare a suggestion plan.';
        }

    }
    changeCountry(){
        let country_id = $('#user-contory').val();
        if(country_id == 1){
            $('#plan-pref').show();
        }else {
            $('#plan-pref').hide();
        }
    }

}



