import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../../shared/form-data';


@Component({
    selector: 'mypage-reservationtour-message-send',
    templateUrl: './message_send.component.html',
    styleUrls: [
        '../../../../../../assets/top/css/mypage.css',
    ]
})
export class MessageSendComponent implements OnInit {
    private current_id = 1;
    private booking_id = 1;
    private booking_name;
    private params = {
        member_id: 1,
        booking_id: 1,
        content: ''
    };
    private language = this.app.getCurrentLanguage();

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        let lang = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : 'ja';
        let curMember = this.app.getCurrentMember();
        this.current_id = curMember ? curMember.id : 1;
        this.booking_id = this.route.snapshot.paramMap.get('id') ? parseInt(this.route.snapshot.paramMap.get('id')) : 1;
        this.app.curMember = this.app.getConfig('CURRENT_MEMBER') ? JSON.parse(this.app.getConfig('CURRENT_MEMBER')) : null;
        if(this.app.curMember) {
            this.getBookingDetail(this.booking_id);
        }
        this.setTitleAndDescription();
        this.app.checkDisplayLanguage(lang);
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅プランメッセージ送信完了　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅プランに対するメッセージ完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getBookingDetail(target_booking_id) {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID');
        let params = {
            language_id: top_lang_id,
            member_id: this.current_id,
            booking_id: target_booking_id
        };
        this.app.get('mypage/reservation/detail', params).then(res =>
        {
            if (res.status == 200) {
                this.booking_name = res.json().data.booking_detail.name;
            } else if(res.status == 401) {
                alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                this.router.navigate([this.app.language]);
            } else {
                this.router.navigate(['page/not-found']);
            }
        });

    }
}

