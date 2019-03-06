import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'reservation-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
    private data = {'booking': [], 'member': [], form_confirm: false, form_complete: true, is_agree_conditions: true };
    private confirmBooking;
    private isDisabled = false;
    private listLanguage;
    private listCountry;
    private listPrefecture;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private date_str;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.confirmBooking = this.getConfirmBooking();
        console.log(this.confirmBooking);
        let booking_date = new Date(this.confirmBooking.booking.date.slice(0,10));
        let date = booking_date.getDay();
        this.date_str = this.app.getDayOfWeek(date);
        this.getListLanguage();
        this.getListCountry();
        this.getListPrefectures();
        let lang = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : 'ja';
        this.app.checkDisplayLanguage(lang);
        this.setTitleAndDescription();
    }

    setTitleAndDescription() {
        $(".page-content__title").html(this.app.ttrans("旅プラン予約申請"));
        this.app.setTitle(this.app.ttrans("旅プラン予約確認　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('旅ガイド作成の旅プランの予約確認画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getConfirmBooking() {
        var confirmBooking = this.app.getConfig('confirmBooking');
        var booking = JSON.parse(confirmBooking);
        return booking;
    }

    payment() {
        let curMember = this.app.getCurrentMember();
        let booking_id = this.app.getConfig('bookingId') ? this.app.getConfig('bookingId') : 1;
        let base_url = this.app.constant.BASE_WEB;
        //this.app.delConfig('confirmBooking');
        window.location.href = base_url+'api/payment/charge/'+curMember.id+'/'+booking_id;
    }

    getListLanguage(){
        this.app.get('languages',{'active':1, 'is_support': 1}).then(res=>{
            if(res.status == 200){
                this.listLanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
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

}
