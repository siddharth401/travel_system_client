import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'content-about',
    templateUrl: './content-about.component.html',
    styleUrls: ['./content-about.component.css']
})
export class ContentAboutComponent implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
    }

    searchPlan() {
        console.log('search-plan');
        $("#target-search-plan").addClass("is-current");
        $("#target-request-plan").removeClass("is-current");
        $("#search-plan").addClass("show-target");
        $("#search-plan").removeClass("hide-target");
        $("#request-plan").removeClass("show-target");
        $("#request-plan").addClass("hide-target");
    }

    requestPlan() {
        console.log('request-plan');
        $("#target-search-plan").removeClass("is-current");
        $("#target-request-plan").addClass("is-current");
        $("#request-plan").addClass("show-target");
        $("#request-plan").removeClass("hide-target");
        $("#search-plan").removeClass("show-target");
        $("#search-plan").addClass("hide-target");
    }
}
