import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

@Component({
    selector: 'plan-completion',
    templateUrl: './completion.component.html',
    styleUrls: [
        '../../../../assets/top/css/suggest.css',
        './completion.component.css'
    ]
})
export class CompletionComponent implements OnInit {
    private data: any;
    private languageName = this.app.getCurrentLanguage();
    private title;
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
}

    ngOnInit() {
        this.app.checkAuthGuider();
        this.app.checkDisplayLanguage(this.languageName);
        this.data = this.app.getConfig('confirmPlan');
        if (this.data && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.data = JSON.parse(this.data);
            this.title = this.data.title_request;
            this.app.delConfig('confirmPlan');
        } else if(this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            alert(this.app.ttrans("このリンクはあなたがアクセスできません。"));
            this.router.navigate([this.languageName]);
        }
        this.setTitleAndDescription();
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('旅リクエストへのプラン提案完了　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('旅リクエストへのガイドからの提案完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }
}

