import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/app.service';
import { ActivatedRoute } from '@angular/router';
import { Filter } from "../shared/filter/filter";

@Component({
    selector: 'admin-prefecture-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit
{
    private filter;
    private listCountry = {};
    private language_id = this.app.getConfig('BACKEND_LANG_ID');

    constructor
    (
        private app: AppService,
        private route: ActivatedRoute
    ) { }

    ngOnInit()
    {
        this.filter = new Filter(this.app,this.route,'prefectures',{'language_id' : this.language_id});
        this.getListCountry();
    }

    getListCountry()
    {
        this.app.get('countries/list_by_language',{'language_id':this.language_id}).then(res =>
        {
            if (res.status === 200) {
                this.listCountry = this.app.arrToList(res.json().data, 'id', 'prefecture_name');
            }
        });
    }
}