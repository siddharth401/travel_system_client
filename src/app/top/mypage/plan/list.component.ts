import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';

@Component({
    selector: 'mypage-plan-create',
    templateUrl: './list.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './list.component.css'
    ]
})
export class ListComponent implements OnInit {
    private data: any;
    private curMember = this.app.getCurrentMember();
    public listPlan={data:[],total:'',last_page: '', current_page: ''};
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.language;

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.app.checkDisplayLanguage(this.languageName);
        if(this.app.curMember) {
            this.app.get('mypage/plan', {member_id: this.curMember.id, language_id: this.language_id}).then(res => {
                if (res.status == 200) {
                    this.listPlan = res.json().data;
                } else if(res.status == 401) {
                    alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                    this.router.navigate([this.app.language]);
                }
            });
            if (this.app.getConfig('confirmEditPlan')) {
                this.app.delConfig('confirmEditPlan');
            }
            this.setTitleAndDescription();
        }

    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page -  the travel plan - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('My page - the list of the travel plans. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')
            }
        ]);
    }

    goToF45(){
        this.router.navigate([this.languageName + '/mypage/plan/create']);
    }

    goToDetail(language_id){
        this.app.setConfig('language_id_plan',language_id);
    }

    loadMore(){
        if(parseInt(this.listPlan.last_page) > 1)
        {
            this.app.get('mypage/plan',{page: this.listPlan.current_page + 1, language_id: this.language_id,limit:10}).then(res => {
                if (res.status == 200) {
                    let data = res.json().data;
                    this.listPlan.current_page = data.current_page;
                    this.listPlan.last_page = data.last_page;
                    this.listPlan.data = this.listPlan.data.concat(data.data);
                }
            });
        }
    }
    reviewPlan(plan){
        let plan_lang_id = plan[0].language_id;
        if(plan.length > 1){
            if(plan[0].language_id != this.language_id){
                plan_lang_id = plan[1].language_id;
            }
        }
        this.app.setConfig('plan_review_language_id',plan_lang_id);
    }
}

