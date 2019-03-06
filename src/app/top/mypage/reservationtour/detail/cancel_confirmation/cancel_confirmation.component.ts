import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../../shared/form-data';


@Component({
    selector: 'mypage-reservationtour-cancel-confirmation',
    templateUrl: './cancel_confirmation.component.html',
    styleUrls: [
        '../../../../../../assets/top/css/mypage.css',
        './cancel_confirmation.component.css'
    ]
})
export class CancelConfirmationComponent implements OnInit {
    private data = {booking: {address: ''}, commission: [], amount: {}, cancel_rate: ''};
    private booking_id;
    private date_actual_str;
    private error;
    private language = this.app.getCurrentLanguage();
    private addressMap;
    private data_params = {booking_id: 1, form_confirm: false, form_complete: false, is_agree_conditions: false };

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        window.scroll(0, 0);
        this.app.checkAuth();
        this.app.checkDisplayLanguage(this.app.language_url);
        this.setTitleAndDescription();
        var confirmCancelBooking = this.app.getConfig('confirmCancelBooking');
        this.booking_id = this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id') : 1;
        if(confirmCancelBooking && this.app.curMember) {
            this.getDataFromStorage();
        } else if(this.app.curMember) {
            this.cancelBooking(this.booking_id);
        }
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅プランキャンセル　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 予約した旅プランのキャンセル確認画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    cancelBooking(id) {
        //change status booking to cancel
        this.data_params.booking_id = id;
        this.data_params.form_complete = false;
        this.data_params.form_confirm = true;
        this.app.post('mypage/reservation/cancel', this.data_params).then(res => {
            if (res.status === 200) {
                var booking = res.json().data;
                this.app.setConfig('confirmCancelBooking', JSON.stringify({
                    booking:booking.booking,
                    commission:booking.commission,
                    amount:booking.amount,
                    cancel_rate:booking.cancel_rate
                }));
                this.data.booking = booking.booking;
                this.data.commission.push(booking.commission);
                this.data.amount = booking.amount;
                this.data.cancel_rate = booking.cancel_rate;
                this.date_actual_str = this.app.getDayOfWeek(parseInt(booking.booking['dayofweek_date_actual']));
                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data.booking.address + ',Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
            } else if(res.status == 401) {
                alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                this.router.navigate([this.language]);
            }
        });
    }

    getDataFromStorage() {
        var confirmCancelBooking = this.app.getConfig('confirmCancelBooking');
        if(confirmCancelBooking) {
            var booking = JSON.parse(confirmCancelBooking);
            this.data.booking = booking.booking;
            this.data.commission.push(booking.commission);
            this.data.amount = booking.amount;
            this.data.cancel_rate = booking.cancel_rate;
            this.date_actual_str = this.app.getDayOfWeek(parseInt(booking.booking['dayofweek_date_actual']));
            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data.booking.address + ',Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
        } else {
            let top_lang = this.app.getConfig('TOP_LANG');
            this.router.navigate([top_lang+'/mypage/reservationtour/detail/'+this.booking_id]);
        }

    }

    cancelCompletation(id) {
        var is_agree_conditions = this.app.constant.FALSE;
        if($('#check-privacy').is(':checked') == true){
            is_agree_conditions = this.app.constant.TRUE;
        }
        this.app.post('mypage/reservation/cancel', {booking_id: id, form_complete: true, form_confirmation: false, is_agree_conditions: is_agree_conditions}).then(res => {
            let top_lang = this.app.getCurrentLanguage();
            if (res.status === 200) {
                let confirmCancelBooking = this.app.getConfig('confirmCancelBooking');
                let booking = JSON.parse(confirmCancelBooking);
                booking.booking.status = this.app.constant.CANCEL;
                this.app.setConfig('confirmCancelBooking', JSON.stringify({
                    booking:booking.booking,
                    commission:booking.commission,
                    amount:booking.amount,
                    cancel_rate:booking.cancel_rate
                }));
                this.router.navigate([top_lang+'/mypage/reservationtour/detail/'+id+'/cancel_completation']);
            } else if(res.status == 400) {
                alert(this.app.ttrans('このプランは実行日が過ごして、ガイドさんも承認していなかったので、管理者が処理を行うことが必要です。管理者に連絡してください。'));
            } else {
                this.error = res.json();
            }
        });
    }
}

