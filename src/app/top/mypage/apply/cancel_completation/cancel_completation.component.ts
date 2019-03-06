import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';


@Component({
    selector: 'mypage-apply-cancel-completation',
    templateUrl: './cancel_completation.component.html',
    styleUrls: [
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class CancelCompletationComponent implements OnInit {
    private language = this.app.getCurrentLanguage();
    private booking_name = this.app.getConfig('APPLY_BOOKING_NAME');

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuthGuider();
        window.scroll(0, 0);
        this.app.delConfig('APPLY_BOOKING_NAME');
        this.app.checkDisplayLanguage(this.app.language_url);
        this.setTitleAndDescription();
    }

    setTitleAndDescription() {
        this.app.setTitle("マイページ - 旅プランキャンセル完了　l　マッチングガイド - MATCHING GUIDE");
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: 'マッチングガイドの会員専用マイページ。ガイドとして、旅行者として両方の面での活動状況が確認可能。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。'}
        ]);
    }
}

