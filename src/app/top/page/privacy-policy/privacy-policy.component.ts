import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";


@Component({
    selector: 'top-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['../../../../assets/top/css/privacypolicy.css']

})
export class PrivacyPolicyComponent implements OnInit {

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
        this.app.setTitle(this.app.ttrans('プライバシーポリシー　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('マッチングガイドのプライバシーポリシー（個人情報保護方針）です。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')
            }
        ]);
    }

}
