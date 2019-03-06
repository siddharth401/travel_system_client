import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'top-mypage-request-list',
    templateUrl: './list.component.html',
    styleUrls: [
        './list.component.css',
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class MypageRequestListComponent implements OnInit {
    private params = {
        language_id: '',
        member_id: 1
    };
    private requests;
    private language;
    private curMember = this.app.getCurrentMember();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.app.checkAuth();
        this.app.checkDisplayLanguage(this.app.language_url);
        this.language = this.app.getCurrentLanguage();
        this.setTitleAndDescription();
        if(this.curMember) {
            this.getListRequest();
        }

    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅リクエスト一覧　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅ユーザーからの旅リクエストプラン一覧。自分でガイドできそうなプランを提案ください。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getListRequest() {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID');
        this.params.language_id = top_lang_id;
        this.params.member_id = this.curMember ? this.curMember.id : 1;
        this.app.get('mypage/requests', this.params).then(res =>
        {
            if (res.status == 200) {
                this.requests = res.json().data;
            }
        });

    }

}
