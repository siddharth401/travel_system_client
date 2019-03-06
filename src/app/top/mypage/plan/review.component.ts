import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';

@Component({
    selector: 'mypage-plan-create',
    templateUrl: './review.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        // './detail.component.css'
    ]
})
export class ReviewComponent implements OnInit {
    private data = {data:[],total:'',last_page: '', current_page: ''};
    private plan = {};
    private plan_id;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.language;
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    private plan_language_id  = this.app.getConfig('plan_review_language_id') ? this.app.getConfig('plan_review_language_id') : this.app.getConfig('TOP_LANG_ID');
    ngOnInit() {
        this.app.checkAuthGuider();
        window.scroll(0,0);
        this.setTitleAndDescription();
        this.app.checkDisplayLanguage(this.languageName);
        this.route.params.subscribe((params) => {
            if (params['id'] && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
                this.plan_id = params['id'];
                this.app.get('mypage/list_review_plan', {plan_id: params['id'],language_id: this.plan_language_id}).then(res => {
                    if (res.status == 200) {
                        this.plan = res.json().plan;
                        this.data = res.json().data;
                    } else {
                        alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                        this.router.navigate([this.languageName]);
                    }
                });
            }
        });
    }
    loadMore(){
        this.route.params.subscribe((params) => {
            if (params['id']) {
                if (this.data.last_page > this.data.current_page) {
                    this.app.get('mypage/list_review_plan', {page: this.data.current_page + 1,plan_id: params['id'], language_id: this.plan_language_id}).then(res => {
                        if (res.status == 200) {
                            let data = res.json().data;
                            this.data.current_page = data.current_page;
                            this.data.last_page = data.last_page;
                            this.data.data = this.data.data.concat(data.data);
                        }
                    });
                }
            }
        });
    }
    goToF49(){
        this.router.navigate([this.languageName + '/mypage/plan/detail/'+this.plan_id]);
    }

    seeFull(id){
        $('.limit-'+id).hide();
        $('.full-'+id).show();
        $('.full-'+id).css({'white-space': 'pre-wrap','word-break': 'break-all','line-height' :'24px'});
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - 旅プラン口コミ一覧 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('マイページ - 旅プランの口コミ一覧。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')
            }
        ]);
    }
}

