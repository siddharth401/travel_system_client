import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from "../app.service";

@Component({
    selector: 'top-mypage-head',
    templateUrl: './top-mypage-head.component.html',
    styleUrls: [
        './top-mypage-head.component.css',
        '../../../assets/top/css/mypage.css'
    ]
})
export class TopMypageHeadComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private curMember = this.app.getCurrentMember();
    private language = this.app.getCurrentLanguage();
    private languageName = this.app.getConfig('TOP_LANG');
    private params = {'language_id':this.language_id,'member_id':''};
    private listMember = {'banner':'','avatar' : ''};
    private mail_completation;
    private email;
    constructor
    (
        private app: AppService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.params.member_id = this.curMember ? this.curMember.id : 1;
        this.route.params.subscribe((params) => {
            if (params && this.curMember) {
                this.app.get('mypage/profile', this.params).then(res => {
                    if (res.status == 200) {
                        this.listMember = res.json().data;
                    }
                });
            }
        });
        let curUrl = window.location.href;
        this.mail_completation = curUrl.indexOf("mail_completation");


    }


    updateProfile() {
        this.router.navigate([this.language+'/mypage/profile']);
    }
    resum(){
        this.router.navigate([this.language+'/mypage/profile/resume/']);
    }

}
