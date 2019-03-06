import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'top-mypage-apply-list',
    templateUrl: './list.component.html',
    styleUrls: [
        './list.component.css',
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class MypageApplyListComponent implements OnInit {
    private params = {
        language_id: '',
        member_id: 1,
    };
    private applies;
    private language;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.app.checkAuthGuider();
        this.language = this.app.getCurrentLanguage();
        this.app.checkDisplayLanguage(this.app.language_url);
        this.setTitleAndDescription();
        let curMember = this.app.getCurrentMember();
        if(curMember && curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.getListApply();
        }
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅ガイド：応募一覧 l マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅プランへの応募一覧。ここからどれだけ応募があったのか確認可能。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getListApply() {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID');
        this.params.language_id = top_lang_id;
        let curMember = this.app.getCurrentMember();
        this.params.member_id = curMember.id;
        this.app.get('mypage/apply', this.params).then(res =>
        {
            if (res.status == 200) {
                this.applies = res.json().data;
            } else if(res.status == 401) {
                alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                this.router.navigate([this.language]);
            }
        });

    }

}
