import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'member-add-completion',
    templateUrl: './completion.component.html',
    styleUrls:['./completion.component.css']
})
export class MemberAddCompletionComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getConfig('TOP_LANG');
    private resent = this.app.getConfig('RESENT_ACCOUNT');
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.app.setTimeOutRedirectAuto();
    }

    btnClose(){
        this.router.navigate([this.languageName]);
    }
}