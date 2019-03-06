import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../shared/form-data';


@Component({
    selector: 'mail-send',
    templateUrl: './mail_send.component.html',
    styleUrls: [
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class MailSendComponent implements OnInit {
    private languageName = this.app.getConfig('TOP_LANG');
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        if(this.app.curMember) {
            this.app.checkDisplayLanguage(this.languageName);
            this.setTitleAndDescription();
        }
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('F41_マイページ - メールアドレス送信完了 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('F41_マイページ - メールアドレス送信完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

}

