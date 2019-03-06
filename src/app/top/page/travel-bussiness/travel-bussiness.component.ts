import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";


@Component({
    selector: 'top-travel-bussiness',
    templateUrl: './travel-bussiness.component.html'
})
export class TravelBussinessComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit() {
        window.scrollTo(0,0);
    }

}
