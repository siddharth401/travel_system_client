import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../shared/form-data';


@Component({
    selector: 'request',
    templateUrl: './request.component.html',
    styleUrls: [
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class RequestComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getCurrentLanguage();

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        if(this.app.curMember) {
            window.scroll(0,0);
            this.app.checkDisplayLanguage(this.languageName);
            this.setTitleAndDescription();
        }
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - 本人確認書類申請完了 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 本人確認書類申請完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

}

