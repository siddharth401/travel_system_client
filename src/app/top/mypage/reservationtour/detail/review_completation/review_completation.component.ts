import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../../shared/form-data';


@Component({
    selector: 'mypage-reservationtour-review-completation',
    templateUrl: './review_completation.component.html',
    styleUrls: [
        '../../../../../../assets/top/css/mypage.css',
    ]
})
export class ReviewCompletationComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getConfig('TOP_LANG');
    private booking_id;
    private title_plan = this.app.getConfig('F24_title_plan');

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.route.params.subscribe((params) =>{
            this.booking_id = params['id'];
        });
        this.setTitleAndDescription();
        this.app.checkDisplayLanguage(this.languageName);
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - 旅プラン口コミ投稿完了　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 体験した旅プランの口コミ登録完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }
}

