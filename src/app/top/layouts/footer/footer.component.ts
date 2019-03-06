import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'top-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    private listCategory;

    constructor(private router: Router,
                private app:AppService) {
    }

    ngOnInit() {
    }
}
