import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'top-mypage-request-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: [
        '../../../../../assets/top/css/mypage.css',
        './confirmation.component.css'
    ]
})
export class MypageRequestConfirmationComponent implements OnInit {
    private data = { 'request': [], form_confirm: false, form_complete: false, is_agree_conditions: false };
    private request = {member_id: 1, title: '', date_plan: '', hour: '', minute: '', time_request_hour: '', time_request_minute: '',plan_hour: '', country_id: 1, prefecture_id: '', categories: [], num_people: '', desire_price: '', language_id: '', desc: '', date_end: ''};
    private date_plan_str;
    private date_end_str;
    private listCountryFrontendList;
    private cities;
    private isDisabled = false;
    private listCountry;
    private listLanguage;
    private categories;
    private language_id = this.app.getConfig('TOP_LANG_ID');

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.app.checkAuth();
        window.scroll(0, 0);
        this.getDataConfirmation();
        this.getListLanguage();
        this.getListCountryFrontendList();
        this.getCategories();
        this.app.checkDisplayLanguage(this.app.language_url);
        this.setTitleAndDescription();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅リクエスト確認　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅リクエスト確認画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }
    
    getDataConfirmation() {
        if(this.app.getConfig('confirmMyPageRequest')) {
            var confirmRequest = this.app.getConfig('confirmMyPageRequest');
            var request = JSON.parse(confirmRequest);
            this.request = request.request;
            //get list city follow country of request
            this.getListCities(request.request.country_id);
            //get date plan with day of week
            let date_plan = new Date(this.request.date_plan.slice(0,10));
            let day_date_plan = date_plan.getDay();
            this.date_plan_str = this.app.getDayOfWeek(day_date_plan);
            //get date end with day of week
            let date_end = new Date(this.request.date_end.slice(0,10));
            let day_date_end = date_end.getDay();
            this.date_end_str = this.app.getDayOfWeek(day_date_end);
            this.data.request.push(request.request);
            this.app.setConfig('REQUEST_TITLE', this.request.title);
        } else {
            this.router.navigate([this.app.language+'/mypage/request/add']);
        }

    }

    completationData(is_completation) {
        this.isDisabled = true;
        this.data.form_complete = is_completation;
        this.app.post('mypage/requests/add', this.data).then(res => {
            if (res.status === 200) {
                this.app.number_on_header.count_requests = this.app.number_on_header.count_requests + 1;
                this.app.delConfig('confirmMyPageRequest');
                this.router.navigate([this.app.language+'/mypage/request/completion']);
            }
        });
    }

    getListCities(country_id = this.app.constant.COUNTRY_DEFAULT) {
        this.app.get('cities/list_by_country', {'language_id':this.language_id, 'country_id': country_id}).then(res => {
            if (res.status === 200) {
                this.cities = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    getListCountry() {
        this.app.get('countries', {'active': 1}).then(res => {
            if (res.status === 200) {
                this.listCountry = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    getListCountryFrontendList(){
        this.app.get('countries/frontend_lists', {'type': this.app.constant.COUNTRY_IS_PROFILE, 'language_id': this.language_id}).then(res =>
        {
            if (res.status == 200) {
                this.listCountryFrontendList = this.app.arrToList(res.json().data, 'id','display_name');
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

    getCategories() {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID') ? this.app.getConfig('TOP_LANG_ID') : 1;
        this.app.get('categories/get_categories_by_language', {'language_id': top_lang_id}).then(res => {
            if (res.status === 200) {
                this.categories = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

}
