import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../shared/app.service";

@Component({
    selector: 'top-request',
    templateUrl: './request.component.html',
})
export class RequestComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        let lang = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : 'ja';
        this.app.checkDisplayLanguage(lang);
    }




}
