import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../shared/form-data';


@Component({
    selector: 'update',
    templateUrl: './update.component.html',
    styleUrls: [
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class UpdateComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getConfig('TOP_LANG');
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        window.scrollTo(0,0);
        this.app.checkDisplayLanguage(this.languageName);
        this.setTitleAndDescription();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - プロフィール変更完了 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - プロフィールの変更登録完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

}

