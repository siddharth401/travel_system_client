import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';

@Component({
    selector: 'plan-completion',
    templateUrl: './apply.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
    ]
})
export class ApplyComponent implements OnInit {
    private data: any;
    private languageName = this.app.language;

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuthGuider();
        this.app.uploadImagePlans = [];
        this.app.checkDisplayLanguage(this.languageName);
        this.setTitleAndDescription();
        window.scroll(0,0);
        this.data = this.app.getConfig('confirmCreatePlan');
        if (this.data && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.app.delConfig('confirmCreatePlan');
        } else if(this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.languageName+'/mypage/plan/create']);
        }
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - apply the the travel plan - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('My page - the application completed screen for the travel plan. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')
            }
        ]);
    }
}

