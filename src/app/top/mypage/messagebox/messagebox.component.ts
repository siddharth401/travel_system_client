import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';


@Component({
    selector: 'messagebox',
    templateUrl: './messagebox.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
    ]
})
export class MessageboxComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private data = [];
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        if(this.app.curMember) {
            this.app.checkDisplayLanguage(this.app.language);
            this.app.get('mypage/messagebox',{language_id:this.language_id}).then(res => {
                if (res.status == 200) {
                    this.data = res.json().data;
                }
            });
            this.setTitleAndDescription();
        }
     }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - メッセージBOX l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - メッセージ管理画面。今までやり取りしたメッセージの履歴閲覧可能。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    readMessage(id,url){
        this.app.get('top_commons/messages_read',{id : id}).then(res => {
            if (res.status == 200) {
                this.app.number_on_header.count_unread = res.json().is_read == 0 ? this.app.number_on_header.count_unread - 1 : this.app.number_on_header.count_unread;
                this.router.navigate(['/' + url]);
            }
        });
    }
}

