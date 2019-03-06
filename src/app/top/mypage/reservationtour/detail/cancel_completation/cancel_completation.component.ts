import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../../shared/form-data';


@Component({
    selector: 'mypage-reservationtour-cancel-completation',
    templateUrl: './cancel_completation.component.html',
    styleUrls: [
        '../../../../../../assets/top/css/mypage.css',
    ]
})
export class CancelCompletationComponent implements OnInit {
    private booking_id;
    private booking_name;
    private language = this.app.getCurrentLanguage();

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        var confirmCancelBooking = this.app.getConfig('confirmCancelBooking');
        if(confirmCancelBooking && this.app.curMember) {
            var booking = JSON.parse(confirmCancelBooking);
            this.booking_name = booking.booking.name;
            this.app.checkDisplayLanguage(this.app.language_url);
            this.booking_id = this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id') : 1;
            this.setTitleAndDescription();
        } else if(this.app.curMember) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.app.language]);
        }

    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅プランキャンセル完了　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 予約した旅プランのキャンセル完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }
}

