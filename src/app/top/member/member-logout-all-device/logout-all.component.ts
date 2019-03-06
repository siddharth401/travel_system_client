import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'member-logout-all',
    templateUrl: './logout-all.component.html',
})
export class MemberLogoutAllComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        let top_token = this.app.getConfig('TOP_TOKEN');
        this.app.post('mypage/profile/removeSessionLogin', {top_token: top_token}).then(res =>
        {
            if (res.status == 200) {
                this.app.deleteFrontendStorage();
                this.router.navigate(["/"]);
            } else {
                this.router.navigate(["/"]);
            }
        });
    }

}
