import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {constant} from "../../shared/constant";

@Component({
    selector: 'layout-loading',
    templateUrl: './loading.component.html',
    styleUrls: [
        '../../../assets/top/css/global.css',
        '../../../assets/top/css/index.css',
        './loading.component.css'
    ],
    encapsulation: ViewEncapsulation.None

})
export class LoadingComponent implements OnInit {
    constructor(private router: Router) {
    }

    ngOnInit() {
    }
}
