import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";


@Component({
    selector: 'top-about-company',
    templateUrl: './about-company.component.html',
    styleUrls: ['../../../../assets/top/css/company.css']
})
export class AboutCompanyComponent implements OnInit {

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
        this.app.setTitle(this.app.ttrans("運営会社　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('プラン予約完了した旨が表示される。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

}
