import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'top-proposal-payment-error',
    templateUrl: './proposal-plan-error.component.html',
    styleUrls: ['./proposal-plan-error.component.css']
})
export class ProposalPaymentErrorComponent implements OnInit {
    private plan_id;
    private plan_title;
    private request_title;
    private request_id;

    constructor(
        private app: AppService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.app.checkDisplayLanguage(this.app.language);
        if(this.app.getConfig('booking_plan_id')){
            this.plan_id = this.app.getConfig('booking_plan_id');
            this.app.delConfig('booking_plan_id');
        }else {
        }
        if(this.app.getConfig('title_plan')){
            this.plan_title = this.app.getConfig('title_plan');
            this.app.delConfig('title_plan');
        }
        if(this.app.getConfig('title_request')){
            this.request_title = this.app.getConfig('title_request');
        }
        if(this.app.getConfig('booking_request_id')){
            this.request_id = this.app.getConfig('booking_request_id');
        }
    }


}
