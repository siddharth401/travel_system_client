import {NgModule, Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'search-breadcrumb',
    templateUrl: './breadcrumb.component.html'
})

export class SearchBreadcrumbComponent implements OnInit {
    @Input() public option:any;
    @Input() public last:any;
    @Input() public language:any;
    private params = [];
    constructor(
        private router: Router,
        private app:AppService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        //custom option 1 with keep params before that
        var length = this.option.length;
        var params_tmp = "";
        for(var i = 0; i< length; i++){
            this.option[i][1] = params_tmp+this.option[i][1]+'/';
            params_tmp = this.option[i][1];
            this.option[i][1] = this.option[i][1].slice(0, -1);
        }
    }
    search(params_url) {
        var url = decodeURI(params_url);
        return '/'+this.app.language+'/search/'+url;
    }
}
