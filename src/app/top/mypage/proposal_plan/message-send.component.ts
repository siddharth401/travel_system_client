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
    private plan_id;
    private plan_title;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private id = 1;
    private languageName = this.app.language;
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    ngOnInit() {
        this.app.checkAuth();
        if(this.app.curMember) {
            window.scroll(0,0);
            this.app.checkDisplayLanguage(this.languageName);
            this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.plan_id = params['id'];
                    this.app.get('mypage/detail_suggest_plan',{plan_id:params['id'],language_id:this.language_id}).then(res=>{
                        if(res.status == 200){
                            if(res.json().data.alert){
                                alert(this.app.ttrans('ユーザーの旅リクエストが現在存在していません。'));
                                this.router.navigate([this.languageName+'/']);
                            }else {
                                this.plan_title = res.json().data.detailSuggestPlan.title;
                            }

                        } else {
                            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                            this.router.navigate([this.languageName+'/']);
                        }
                    });
                }
            });
            this.setTitleAndDescription();
        }
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - sent the message about the proposal of the the travel request - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page -the message sent screen about the travel request proposal. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }
}

