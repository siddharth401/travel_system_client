import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'top-mypage-request-add',
    templateUrl: './add.component.html',
    styleUrls: [
        '../../../../../assets/top/css/mypage.css',
        './add.component.css'
    ]
})
export class MypageRequestAddComponent implements OnInit {
    private data = { 'request': [], form_confirm: false, form_complete: false, is_agree_conditions: false };
    private request = {member_id: 1, title: '', date_plan: '', hour: '00', minute: '00', request_time_hour: '01', request_time_minute: '00', plan_hour: '', country_id: 1, city_id: '', categories: [], num_people: '', desire_price: '', language_id: '', support_language_id: '', desc: '', date_end: '', time_start: ''};
    private error = {};
    private cities;
    private listCountry;
    private price_sum;
    private categories;
    private isDisabled = false;
    private listLanguage;
    private confirm_country_id;
    private exist_city_id = false;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private language = this.app.getCurrentLanguage();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.app.curMember = this.app.getConfig('CURRENT_MEMBER') ? JSON.parse(this.app.getConfig('CURRENT_MEMBER')) : null;
        if(this.app.curMember && this.app.curMember.name == '') {
            alert(this.app.ttrans("旅リクェストを作成する前にプロフィールにおいて、名前とニックネームを入力してください。"));
            this.router.navigate([this.app.language+'/mypage/profile']);
        }
        this.app.checkAuth();
        this.price_sum = '0,000';
        if(this.app.getConfig('confirmMyPageRequest')) {
            let request = this.getConfirmRequest();
            this.request = request.request;
            this.confirm_country_id = request.request.country_id;
            $("#request-price-number").val(this.request.num_people);
            this.price_sum = (parseInt(this.request.desire_price)*parseInt(this.request.num_people)) ? parseInt(this.request.desire_price)*parseInt(this.request.num_people): '0,000';
        }
        this.getListCountry();
        this.getListCities();
        this.getCategories();
        this.getListLanguage();
        this.app.checkDisplayLanguage(this.app.language_url);
        this.setTitleAndDescription();
        this.app.showCalendar();
    }

    getConfirmRequest() {
        var confirmRequest = this.app.getConfig('confirmMyPageRequest');
        var request = JSON.parse(confirmRequest);
        return request;
    }

    getListCountry(){
        this.app.get('countries/frontend_lists', {'type': this.app.constant.COUNTRY_IS_PROFILE, 'language_id': this.language_id}).then(res =>
        {
            if (res.status == 200) {
                this.listCountry = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }

    getListCities() {
        this.exist_city_id = false;
        let country_id = $("#request-location-country").val() ? $("#request-location-country").val() : this.app.constant.COUNTRY_DEFAULT;
        if(this.confirm_country_id) {
            country_id = $("#request-location-country").val() ? $("#request-location-country").val() : this.confirm_country_id;
        }
        this.app.get('cities/list_by_country', {'language_id':this.language_id, 'country_id': country_id}).then(res => {
            if (res.status === 200) {
                this.cities = this.app.arrToList(res.json().data, 'id', 'name');
                if(this.request.city_id != '' && this.cities.hasOwnProperty(this.request.city_id)) {
                    //check exist city id in list cities or not exist
                    this.exist_city_id = true;
                }
            }
        });
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅リクエスト作成　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅リクエスト作成画面。登録されているプランで気に入ったものが無かった場合、ユーザーから希望の旅をリクエストできます。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getListRequestCategory() {
        var chkArray = [];
        $(".form-set__checkbox:checked").each(function() {
            chkArray.push($(this).val());
        });
        return chkArray;
    }

    confirmData(is_confirm) {
        this.isDisabled = true;
        let curMember = this.app.getCurrentMember();
        this.request.member_id = curMember ? curMember.id : 1;
        this.request.title = $("#request-title").val();
        this.request.date_plan = $("#input-date").val();
        this.request.hour = $("#request-date-start01").val();
        this.request.minute = $("#request-date-start02").val();
        this.request.time_start = this.request.hour+":"+this.request.minute;
        this.request.request_time_hour = $("#request-time-hour").val();
        this.request.request_time_minute = $("#request-time-minute").val();
        this.request.plan_hour = this.request.request_time_hour+":"+this.request.request_time_minute;
        this.request.country_id = $("#request-location-country").val();
        this.request.city_id = $("#request-location-city").val();
        //get list request categories
        this.request.categories = this.getListRequestCategory();
        this.request.num_people = $("#request-number").val();
        this.request.desire_price = $("#request-price-cost").val();
        this.request.support_language_id = $("#request-lang").val();
        this.request.language_id = this.app.getConfig('TOP_LANG_ID') ? this.app.getConfig('TOP_LANG_ID') : 1;
        this.request.desc = $("#request-content").val();
        this.request.date_end = $("#date-end").val();
        this.data.request.push(this.request);
        this.data.form_confirm = true;
        this.app.post('mypage/requests/add', this.data).then(res => {
            if (res.status === 200) {
                let top_lang = this.app.getConfig('TOP_LANG');
                this.app.setConfig('confirmMyPageRequest', JSON.stringify({
                    request:this.request
                }));
                this.router.navigate([top_lang+'/mypage/request/confirmation']);
                window.scrollTo(0,300);
            } else {
                this.isDisabled = false;
                this.data.request = [];
                this.error = res.json();
                window.scrollTo(0,400);
            }
        });
    }

    changeNumPeople(num_people) {
        $("#request-price-number").val(num_people);
        $("#request-number").val(num_people);
        this.request.num_people = num_people;
        this.price_sum = $("#request-price-cost").val()*num_people ? $("#request-price-cost").val()*num_people : '0,000';
    }

    changeDesirePrice(desire_price) {
        var num_people = $("#request-price-number").val();
        this.request.desire_price = desire_price;
        this.price_sum = desire_price*num_people ? desire_price*num_people : '0,000';

    }

    getCategories() {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID') ? this.app.getConfig('TOP_LANG_ID') : 1;
        this.app.get('categories/get_categories_by_language', {'language_id': top_lang_id}).then(res => {
            if (res.status === 200) {
                this.categories = res.json().data;
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

    checkInArrayCategory(array, value) {
        let val = value.toString();
        if(array.indexOf(val) > -1) {
            return true;
        }
        return false;
    }

}
