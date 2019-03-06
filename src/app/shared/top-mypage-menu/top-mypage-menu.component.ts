import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from "../app.service";

@Component({
    selector: 'top-mypage-menu',
    templateUrl: './top-mypage-menu.component.html',
    styleUrls: ['./top-mypage-menu.component.css']
})
export class TopMypageMenuComponent implements OnInit {
    private curMember = this.app.getCurrentMember();
    private language = this.app.getCurrentLanguage();
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private member_id;
    constructor
    (
        private app: AppService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.member_id = this.curMember ? this.curMember.id : 1;
    }
    redirect(url) {
        this.router.navigate([this.language+ url]);
    }
}
