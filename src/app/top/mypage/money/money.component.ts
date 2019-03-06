import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'top-mypage-money',
    templateUrl: './money.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './money.component.css'
    ]
})
export class MypageMoneyComponent implements OnInit {
    private language;
    private data;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.app.checkAuthGuider();
        if(this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            let lang = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : 'ja';
            this.app.checkDisplayLanguage(lang);
            this.cashpost();
            this.language = this.app.getCurrentLanguage();
            this.setTitleAndDescription();
        }

    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅ガイド：売上額確認 l マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅ガイド売上額確認画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }
    
    cashpost(){
        let today = new Date();
        let params = {
            'year': today.getFullYear(),
            'month': today.getMonth() + 1
        };
        this.app.get('mypage/castpost', params).then(res =>
        {
            if (res.status == 200) {
                this.data = res.json().data;
            } else {
                alert('このリンクはあなたがアクセスできません。');
                this.router.navigate([this.language]);
            }
        });
    }

    getDataOnMonth(param_month, param_year, is_next = false) {
        let today = new Date();
        let month = parseInt(param_month);
        let year = parseInt(param_year);
        if(is_next == true && month === 12) {
            month = 1;
            year += 1;
        } else if(is_next == false && month === 1) {
            month = 12;
            year -= 1;
        } else if(is_next == true) {
            month += 1;
        } else {
            month -= 1;
        }
        let params = {
            'year': year,
            'month': month
        };
        this.app.get('mypage/castpost', params).then(res =>
        {
            if (res.status == 200) {
                this.data = res.json().data;
            }
        });
    }

}
