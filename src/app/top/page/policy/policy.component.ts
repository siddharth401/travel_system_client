import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";


@Component({
    selector: 'top-policy',
    templateUrl: './policy.component.html',
})
export class PolicyComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit() {
        window.scrollTo(0,0);
        this.app.checkDisplayLanguage(this.app.language);
        this.setTitleAndDescription();
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('利用規約　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('マッチングガイド利用規約。必ずご確認ください。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')
            }
        ]);
    }

}
