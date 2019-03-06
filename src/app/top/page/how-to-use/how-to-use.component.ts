import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";


@Component({
    selector: 'top-how-to-use',
    templateUrl: './how-to-use.component.html',
    styleUrls: [
        '../../../../assets/top/css/usage.css',
    ]

})
export class HowToUseComponent implements OnInit {

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
        this.app.setTitle(this.app.ttrans('マッチングガイドの使い方　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('マッチングガイドの利用方法説明ページです。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')
            }
        ]);


    }
    usage01(){
        $('html, body').animate({
            scrollTop: $("#usage01").offset().top
        }, 900);
    }
    usage02(){
        $('html, body').animate({
            scrollTop: $("#usage02").offset().top
        }, 900);
    }
    usage03(){
        $('html, body').animate({
            scrollTop: $("#usage03").offset().top
        }, 900);
    }
    usage04(){
        $('html, body').animate({
            scrollTop: $("#usage04").offset().top
        }, 900);
    }

}
