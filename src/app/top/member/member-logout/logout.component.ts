import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'member-logout',
    templateUrl: './logout.component.html',
})
export class MemberLogoutComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        $('.loadingRequest').hide();
        let top_token = this.app.getConfig('TOP_TOKEN');
        var newURL = window.location.protocol + "//" + window.location.host + "/" + this.app.language;
        var isMobile = window.matchMedia("only screen and (max-width: 760px)");
        this.app.get('members/logout', {top_token: top_token}).then(res =>
        {
            if (res.status == 200) {
                this.app.deleteFrontendStorage();
                if (isMobile.matches) {
                    window.location.href = newURL;
                } else {
                    this.router.navigate([this.app.language]);
                }
            } else {
                if (isMobile.matches) {
                    window.location.href = newURL;
                } else {
                    this.router.navigate([this.app.language]);
                }
            }
        });
    }

}
