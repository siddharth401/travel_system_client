import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AppService} from "../../shared/app.service";

@Component({
    selector: 'mypage',
    templateUrl: './mypage.component.html',
    styleUrls: ['./mypage.component.css',
        '../../../assets/top/css/mypage.css',
        '../../../assets/top/css/detail-list.css',
    ]
})
export class MypageComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private language = this.app.getCurrentLanguage();
    private member_id;
    private params = {'language_id':this.language_id,'member_id':''};
    private member = {'avatar':'','banner':''};
    private currentMember = this.app.getCurrentMember();
    constructor(private router: Router,
                private route: ActivatedRoute,
                private app: AppService) {
    }
    
    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0, 0);
        this.member_id = this.currentMember ? this.currentMember.id : null;
        this.app.checkDisplayLanguage(this.language);
        this.setTitleAndDescription();
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - マッチングガイドの会員専用マイページ。ガイドとして、旅行者として両面の活動状況が確認できます。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }
}
