import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';

@Component({
    selector: 'message-input',
    templateUrl: './message-send.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
    ]
})
export class MessageSendComponent implements OnInit {
    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private plan_id;
    private request_id;
    private request_title;
    private plan_title;
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.app.checkDisplayLanguage(this.languageName);
        this.route.params.subscribe((params) => {
            if (params['id'] && this.app.curMember) {
                this.plan_id = params['id'];
                this.app.get('mypage/suggestion/suggest_plan', {plan_id: params['id'], language_id: this.language_id}).then(res => {
                    if (res.status == 200) {
                        this.request_id = res.json().data.request.id;
                        this.request_title = res.json().data.request.title;
                        this.plan_title = res.json().data.plan_suggest.proposal_title;
                    }else {
                        alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                        this.router.navigate([this.app.language]);
                    }
                });
            }
        });
        this.setTitleAndDescription();
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - message about the porposal of  the travel request was sent successully - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page -the message sent screen about the travel request proposal. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }


}

