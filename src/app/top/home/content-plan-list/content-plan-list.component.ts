import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'content-plan-list',
    templateUrl: './content-plan-list.component.html',
    styleUrls: ['./content-plan-list.component.css']
})
export class ContentPlanListComponent implements OnInit {
    @Input() public listCategory;
    @Input() public curMember;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
    }

    showMessage() {
        alert(this.app.ttrans("ガイドのみ旅プランを作ることができます。ガイド登録してください。"));
    }
}
