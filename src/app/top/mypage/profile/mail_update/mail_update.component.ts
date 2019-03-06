import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../shared/form-data';


@Component({
    selector: 'mail-update',
    templateUrl: './mail_update.component.html',
    styleUrls: [
        './mail_update.component.css',
        '../../../../../assets/top/css/mypage.css'
    ]
})
export class MailUpdateComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getConfig('TOP_LANG');
    private data = {'email':''};
    private error = {};
    private curMember = this.app.getCurrentMember();
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        if(this.curMember) {
            window.scroll(0,0);
            this.app.checkDisplayLanguage(this.languageName);
            this.setTitleAndDescription();
        }
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - メールアドレス変更 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - メールアドレス変更画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    saveData(){
        this.data.email = $('#profile-mail').val();
        this.app.post('mypage/profile/mail_update', this.data).then(res => {
            if (res.status == 200) {
                this.router.navigate([this.languageName+'/mypage/profile/mail_send/']);
            }else {
                this.error = res.json();
            }
        });
    }
}

