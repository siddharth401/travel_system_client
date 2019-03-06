import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../shared/form-data';


@Component({
    selector: 'mypage-apply-user-hyouka',
    templateUrl: './user_hyouka_confirm.component.html',
    styleUrls: [
        './user_hyouka_confirm.component.css',
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class UserHyoukaConfirmComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getConfig('TOP_LANG');
    private booking_id;
    private title_plan = this.app.getConfig('F60_title_plan');

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuthGuider();
        if(this.title_plan && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.booking_id = this.route.snapshot.paramMap.get('id');
            this.setTitleAndDescription();
            this.app.checkDisplayLanguage(this.languageName);
        } else if(this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.languageName]);
        }
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - 旅ガイド：ユーザー評価確定 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - ユーザー評価確定画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }
}

