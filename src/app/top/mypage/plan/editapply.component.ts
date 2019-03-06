import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';

@Component({
    selector: 'plan-completion',
    templateUrl: './editapply.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
    ]
})
export class EditApplyComponent implements OnInit {
    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private data;
    private proposal_title;
    private plan_id;
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    ngOnInit() {
        this.app.checkAuthGuider();
        this.app.checkDisplayLanguage(this.languageName);
        this.setTitleAndDescription();
        this.app.image_edit_plans = [];
        this.data = this.app.getConfig('confirmEditPlan');
        if(this.data && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER){
            this.data = JSON.parse(this.data);
            this.proposal_title = this.data.formPlan.proposal_title;
            this.plan_id = this.data.formPlan.id;
            this.app.delConfig('confirmEditPlan');
        } else if(this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.languageName]);
        }
        if(this.app.getConfig('Plan_Language')){
           this.app.delConfig('Plan_Language');
        }

    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - appy to modify the the travel plan - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('My page - the application screen to modifiy the travel plan."MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')
            }
        ]);
    }

}

