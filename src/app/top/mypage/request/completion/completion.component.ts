import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'top-mypage-request-completion',
    templateUrl: './completion.component.html',
    styleUrls: [
        '../../../../../assets/top/css/mypage.css',
        './completion.component.css',
    ]
})
export class MypageRequestCompletionComponent implements OnInit {
    private request_title;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.app.checkAuth();
        window.scroll(0, 0);
        this.setTitleAndDescription();
        this.request_title = this.app.getConfig('REQUEST_TITLE');
        if(this.request_title && this.app.curMember) {
            this.app.delConfig('REQUEST_TITLE');
            this.app.delConfig('confirmMyPageRequest');
            this.app.checkDisplayLanguage(this.app.language_url);
        } else if(this.app.curMember) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.app.language]);
        }

    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅リクエスト完了　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅リクエスト完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }



}
