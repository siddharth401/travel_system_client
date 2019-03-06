import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';


@Component({
    selector: 'mypage-reservationtour',
    templateUrl: './reservationtour.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './reservationtour.component.css'
    ]
})
export class ReservationTourComponent implements OnInit {
    private params = {language_id: '', member_id: 1, page: 1}
    private reservation_tours = {total: '', last_page: '', current_page: '', data: []};

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        this.setTitleAndDescription();
        this.getListReservationTour();
        this.app.checkDisplayLanguage(this.app.language_url);

    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅プラン予約一覧　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 予約した旅プランの履歴一覧。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getListReservationTour() {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID');
        this.params.language_id = top_lang_id;
        let curMember = this.app.getCurrentMember();
        this.params.member_id = curMember && curMember.id ? curMember.id : 1;
        this.app.get('mypage/reservation', this.params).then(res =>
        {
            if (res.status == 200) {
                this.reservation_tours = res.json().data;
            }
        });

    }
}

