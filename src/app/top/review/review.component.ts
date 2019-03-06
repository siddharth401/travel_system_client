import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../shared/app.service";

@Component({
    selector: 'top-request',
    templateUrl: './review.component.html',
    styleUrls: ['../../../assets/top/css/review.css', 'review.component.css']
})
export class ReviewComponent implements OnInit {
    private params = {language_id: ''}
    private reviews = {data: [], total: '', last_page: '', current_page: ''};
    private language = '';
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        window.scrollTo(0,0);
        let lang = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : 'ja';
        this.app.checkDisplayLanguage(lang);
        this.language = this.app.getConfig('TOP_LANG') ? this.app.getConfig('TOP_LANG') : 'ja';
        this.setTitleAndDescription();
        this.getListReview();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("旅ユーザーの口コミ一覧　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('旅プラン体験をした方々の口コミ一覧。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getListReview() {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID');
        this.params.language_id = top_lang_id;
        this.app.get('reviews', this.params).then(res =>
        {
            if (res.status == 200) {
                this.reviews = res.json().data;
            }
        });

    }




}
