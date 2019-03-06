import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'top-mypage-apply-messagesend',
    templateUrl: './messagesend.component.html',
    styleUrls: [
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class MypageApplyMessageSendComponent implements OnInit {
    private language = this.app.getCurrentLanguage();
    private booking_id = 1;
    private booking_name = this.app.getConfig('APPLY_BOOKING_NAME');

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.app.checkAuthGuider();
        this.app.checkDisplayLanguage(this.app.language_url);
        this.booking_id = this.route.snapshot.paramMap.get('id') ? parseInt(this.route.snapshot.paramMap.get('id')) : 1;
        this.setTitleAndDescription();

    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅ガイド：応募メッセージ送信完了 l マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅プランへの応募メッセージ送信完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }




}
