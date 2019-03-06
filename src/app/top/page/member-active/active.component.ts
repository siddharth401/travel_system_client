import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'member-active',
    templateUrl: './active.component.html',
})
export class MemberActiveComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        let extra_token = this.route.snapshot.paramMap.get('extra_token') ? this.route.snapshot.paramMap.get('extra_token') : '';
        let curLanguage = this.app.getCurrentLanguageId();
        this.app.get('members/active', {extra_token: extra_token}).then(res =>
        {
            if (res.status == 200) {
                let data = res.json();
                this.app.setConfig('TOP_TOKEN', data.top_token);
                this.app.setConfig('CURRENT_MEMBER', JSON.stringify(data.profile));
                this.router.navigate([this.app.language+"/mypage/profile"]);
            } else {
                alert(this.app.ttrans("このリンクが無効です。再度登録してください"));
                this.router.navigate([this.app.language]);
            }
        });
    }

}
