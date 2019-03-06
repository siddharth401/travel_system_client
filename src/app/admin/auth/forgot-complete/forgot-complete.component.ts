import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AppService} from '../../../shared/app.service';

@Component({
    selector: 'forgot-complete',
    templateUrl: './forgot-complete.component.html',
})
export class ForgotCompleteComponent implements OnInit {

    constructor(private router: Router, private app:AppService) { }

    ngOnInit() {
        $('.loadingRequest').hide();
    }
}
