import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';


@Component({
    selector: 'favorites',
    templateUrl: './favorites.component.html',
    styleUrls: [
        './favorites.component.css',
        '../../../../assets/top/css/mypage.css',
    ]
})
export class FavoritesComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    /*private languageName = this.app.getConfig('TOP_LANG');*/
    private plan_favorites = {data:[]};
    private request_favorites = {current_page:'',last_page:'',data:[]};
    private member_favorites = {data:[]};
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    private curMember = this.app.getCurrentMember();

    ngOnInit() {
        this.app.checkAuth();
        if(this.curMember) {
            window.scrollTo(0,0);
            this.app.checkDisplayLanguage(this.app.language);
            this.listPlanfavories();
            this.listRequestfavories();
            this.listMemberfavories();
            this.setTitleAndDescription();
        }
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - お気に入り一覧 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - お気に入り一覧です。気になったプランやガイドをお気に入り登録可能。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    listPlanfavories(){
        this.app.get('mypage/plan_favorites',{'member_id' : this.curMember.id,'language_id' : this.language_id}).then(res => {
            if (res.status == 200) {
                this.plan_favorites = res.json().data;
            }
        });
    }

    listRequestfavories(){
        this.app.get('mypage/request_favorites',{'member_id' : this.curMember.id,'language_id' : this.language_id}).then(res => {
            if (res.status == 200) {
                this.request_favorites = res.json().data;
            }
        });
    }

    listMemberfavories(){
        this.app.get('mypage/member_favorites',{'member_id' : this.curMember.id,'language_id' : this.language_id}).then(res => {
            if (res.status == 200) {
                this.member_favorites = res.json().data;
            }
        });
    }
}

