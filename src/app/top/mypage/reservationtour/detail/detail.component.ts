import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../shared/form-data';


@Component({
    selector: 'mypage-reservationtour-detail',
    templateUrl: './detail.component.html',
    styleUrls: [
        '../../../../../assets/top/css/mypage.css',
        './detail.component.css'
    ]
})
export class ReservationTourDetailComponent implements OnInit {
    private params = {language_id: '', member_id: 1, booking_id: 1, page: 1};
    private reservation_detail = {booking_reviews: {current_page: 1, last_page: 1, data: []}, booking_detail: {date_actual: '', phone: '', phone_code: '', status, address: '', traveler_status_go: 0, guider_status_not_go: 0, member_id: '', plans: {member_id: ''}, members: {phone_code: ''}, customer_languages: []}};
    private language = '';
    private data = {booking_id: 1, form_confirm: false, form_complete: false, is_agree_conditions: false };
    private addressMap;
    private languageName = this.app.getConfig('TOP_LANG');
    private day_str;
    private listLanguages;
    private listCountry;
    private listPrefectures;

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0, 0);
        this.language = this.app.getCurrentLanguage();
        this.setTitleAndDescription();
        this.app.checkDisplayLanguage(this.app.language);
        this.app.curMember = this.app.getConfig('CURRENT_MEMBER') ? JSON.parse(this.app.getConfig('CURRENT_MEMBER')) : null;
        if(this.app.curMember) {
            this.getReservationDetail();
        }
        this.getLisLanguages();
        this.getListCountry();
        this.getListPrefectures();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅プラン予約詳細　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 予約した旅プランの詳細。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getReservationDetail() {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID');
        let booking_id = this.route.snapshot.paramMap.get('id') ? parseInt(this.route.snapshot.paramMap.get('id')) : 1;
        this.params.language_id = top_lang_id;
        let current_id = this.app.curMember && this.app.curMember.id ? this.app.curMember.id : null;
        this.params.member_id = current_id;
        this.params.booking_id = booking_id;
        this.app.get('mypage/reservation/detail', this.params).then(res =>
        {
            if (res.status == 200) {
                this.reservation_detail = res.json().data;
                if(this.reservation_detail.booking_detail.date_actual){
                    let d = new Date(this.reservation_detail.booking_detail.date_actual.slice(0,10));
                    let thu = d.getDay();
                    this.day_str = this.app.getDayOfWeek(thu);
                }
                // this.reservation_detail.booking_detail.phone = this.app.convertPhoneNumber(this.reservation_detail.booking_detail.phone);
                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.reservation_detail.booking_detail.address + ',Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
            } else if(res.status == 401) {
                alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                this.router.navigate([this.language]);
            } else {
                this.router.navigate(['page/not-found']);
            }
        });
    }

    loadMore(data){
        let top_lang_id = this.app.getConfig('TOP_LANG_ID') ? this.app.getConfig('TOP_LANG_ID') : 1;
        if(data.last_page > data.current_page)
        {
            this.params.page = this.reservation_detail.booking_reviews.current_page + 1;
            this.params.language_id = top_lang_id;
            this.params.member_id = 1;
            this.app.get('mypage/reservation/detail', this.params).then(res =>
            {
                if (res.status == 200) {
                    let data = res.json().data.booking_reviews;
                    this.reservation_detail.booking_reviews.current_page = data.current_page;
                    this.reservation_detail.booking_reviews.last_page = data.last_page;
                    this.reservation_detail.booking_reviews.data = this.reservation_detail.booking_reviews.data.concat(data.data);
                }
            });
        }
    }

    notComeBooking(id) {
        if(confirm(this.app.ttrans("ガイダが実施キャンセルになりました。管理者は確認します。少々お待ちください。"))) {
            //change status booking to cancel
            this.data.booking_id = id;
            this.data.form_complete = true;
            this.data.form_confirm = true;
            this.data.is_agree_conditions = false;
            this.app.post('mypage/reservation/not_come', this.data).then(res => {
                if (res.status === 200) {
                    alert(this.app.ttrans(res.json().message));
                    this.reservation_detail.booking_detail.guider_status_not_go = this.app.constant.TRUE;
                } else {
                    this.router.navigate(['page/payment/error']);
                }
            });
        } else {
            //don't change status booking
        }
    }

    cancelBooking(id) {
        this.router.navigate([this.language+'/mypage/reservationtour/detail/'+id+'/cancel_confirmation']);
    }
    
    guiderApprove(id) {
        if(confirm(this.app.ttrans("旅プランが承認されます。よろしいでしょうか？"))) {
            //change status booking to guider approved
            this.data.booking_id = id;
            this.data.form_complete = true;
            this.data.is_agree_conditions = false;
            this.app.post('mypage/reservation/approval', this.data).then(res => {
                if (res.status === 200) {
                    this.reservation_detail.booking_detail.status = this.app.constant.GUIDER_APPROVED;
                } else {
                    //this.router.navigate(['page/payment/error']);
                    if(res.json().booking_id && res.json().booking_id[0]) {
                        alert(res.json().booking_id[0]);
                    }
                }
            });
        } else {
            //don't change status booking
        }
    }



    implementBooking(id) {
        if(confirm(this.app.ttrans("旅プランが実施されましたか？"))) {
            //change status booking to cancel
            this.data.booking_id = id;
            this.data.form_complete = true;
            this.data.form_confirm = true;
            this.data.is_agree_conditions = false;
            this.app.post('mypage/reservation/done', this.data).then(res => {
                if (res.status === 200) {
                    this.reservation_detail.booking_detail.traveler_status_go = this.app.constant.TRUE;
                } else {
                    /*this.router.navigate(['page/payment/error']);*/
                    alert("Cannot change status this booking!");
                }
            });
        } else {
            //don't change status booking
        }
    }

    reviewBooking(id) {
        this.router.navigate([this.language+'/mypage/reservationtour/detail/'+id+'/review_register']);
    }

    messageInput(booking_id) {
        this.router.navigate([this.language+'/mypage/reservationtour/detail/'+booking_id+'/message_input']);
    }

    payment(booking_id) {
        if(confirm("Do you want to payment for this booking？")) {
            //payment for booking
            let curMember = this.app.getCurrentMember();
            let base_url = this.app.constant.BASE_WEB;
            window.location.href = base_url+'api/payment/charge/'+curMember.id+'/'+booking_id;
        } else {
            //don't change status booking
        }
    }

    getLisLanguages() {
        this.app.get('languages').then(res =>
        {
            if (res.status == 200) {
                this.listLanguages = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }

    getListCountry(){
        this.app.get('countries/frontend_lists', {'type': this.app.constant.COUNTRY_IS_PROFILE, 'language_id': this.app.getConfig('TOP_LANG_ID')}).then(res =>
        {
            if (res.status == 200) {
                this.listCountry = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }

    getListPrefectures() {
        this.app.get('prefectures/frontend_lists', {'language_id':this.app.getConfig('TOP_LANG_ID')}).then(res => {
            if (res.status === 200) {
                this.listPrefectures = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }
}

