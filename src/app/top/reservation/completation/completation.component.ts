import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'reservation-completation',
    templateUrl: './completation.component.html'
})
export class CompletationComponent implements OnInit {
    private booking_id;
    private booking_title;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.setTitleAndDescription();
        let lang = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : 'ja';
        this.app.checkDisplayLanguage(lang);
        this.booking_id = this.app.getConfig('bookingId');
        let confirmBooking = this.app.getConfig('confirmBooking');
        let booking = JSON.parse(confirmBooking);
        this.booking_title = booking.booking.title;
        this.app.delConfig('bookingId');
        this.app.delConfig('confirmBooking');
        this.app.number_on_header.count_bookings = this.app.number_on_header.count_bookings + 1;
        this.app.delConfig('GUIDER_PLAN_DATE');
    }

    setTitleAndDescription() {
        $(".page-content__title").html(this.app.ttrans("旅旅プラン予約申請"));
        this.app.setTitle(this.app.ttrans("旅プラン予約完了　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('旅ガイド作成旅プランの予約完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

}
