import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../shared/form-data';


@Component({
    selector: 'mail-completation',
    templateUrl: './mail_completation.component.html',
    styleUrls: [
        './mail_completation.component.css',
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class MailCompletationComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getCurrentLanguage();
    private extra_token;
    private email;
    private curMember = this.app.getCurrentMember();
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        this.app.checkDisplayLanguage(this.languageName);
        this.route.params.subscribe((params) => {
            if (params && this.curMember) {
                this.extra_token = params['extra_token'];
                this.email = params['email'];
                this.app.post('mypage/profile/update_email_completed',{'extra_token' : this.extra_token,'email' : this.email,'language_id':this.language_id}).then(res => {
                    if (res.status == 200) {
                        let data = res.json();
                        this.app.setConfig('CURRENT_MEMBER', JSON.stringify(data.profile));
                        if (typeof data.top_token !== 'undefined') {
                            this.app.setConfig('TOP_TOKEN', data.top_token);
                        }
                    } else {
                        alert(this.app.ttrans("このリンクはあなたがアクセスできません。"));
                        this.router.navigate([this.app.language]);
                    }
                });
            }
        });
        this.setTitleAndDescription();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - メールアドレス変更完了 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - メールアドレス変更完了画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

}

