import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/app.service';
import { ActivatedRoute } from '@angular/router';
import { Filter } from "../shared/filter/filter";

@Component({
    selector: 'admin-language-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit
{
    private filter;

    constructor
    (
        private app: AppService,
        private route: ActivatedRoute
    ) { }

    ngOnInit()
    {
        this.filter = new Filter(this.app,this.route,'languages');
        if(this.app.getConfig('admin_language_page')){
            this.app.delConfig('admin_language_page');
        }
    }
    currentPage(){
        this.route.params.subscribe((params) =>
        {
            if(params['page']){
                this.app.setConfig('admin_language_page',params['page']);
            }
        });
    }
}