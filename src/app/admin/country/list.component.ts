import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/app.service';
import { ActivatedRoute } from '@angular/router';
import { Filter } from "../shared/filter/filter";

@Component({
    selector: 'admin-country-list',
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
        this.filter = new Filter(this.app,this.route,'countries');
    }
}