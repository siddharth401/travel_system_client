import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

@Component({
    selector: 'plan-confirmation',
    templateUrl: './editcompletion.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
    ]
})
export class EditCompletionComponent implements OnInit {
    private data: any;
    private plan_id;
    private username;
    private titleRequest;
    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.setTitleAndDescription();
        this.app.checkDisplayLanguage(this.languageName);
        this.data = this.app.getConfig('editconfirmProposalPlan');
        if (this.data && this.app.curMember) {
            this.data = JSON.parse(this.data);
            this.titleRequest = this.data.titleRequest;
            this.plan_id = this.data.formPlan.id;
            this.username = this.data.username;
            this.app.delConfig('editconfirmProposalPlan');
        } else if(this.app.curMember) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.languageName]);
        }

    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - the new proposal of the travel request was submitted successfully - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page - the completed screen for the revised travel request proposal. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

}

