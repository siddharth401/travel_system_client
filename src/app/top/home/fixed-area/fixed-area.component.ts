import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'fixed-area',
    templateUrl: './fixed-area.component.html',
    styleUrls: ['./fixed-area.component.css']
})
export class FixedAreaComponent implements OnInit {
    @Input() public language;
    @Input() public curMember;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        
    }
    
    createPlan() {
        if(this.curMember.type == this.app.constant.MEMBER_USER) {
            alert(this.app.ttrans("ガイドのみ旅プランを作ることができます。ガイド登録してください。"));
        } else {
            this.router.navigate(["/" + this.language + "/mypage/plan/create"]);
        }
    }
    
}
