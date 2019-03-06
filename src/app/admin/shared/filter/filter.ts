import {Params} from '@angular/router';

export class Filter
{
    private app;
    private route;
    private apiUrl;

    public result = {};

    private dataPage = 1;
    private dataFilter = {};
    private dataQuery = {sort: 'id', direction: 'desc'};

    constructor(app,route,apiUrl,dataQuery?)
    {
        this.app = app;
        this.route = route;
        this.apiUrl = apiUrl;
        if (typeof dataQuery !== 'undefined') this.dataQuery = dataQuery;

        this.route.params.subscribe
        (
            (params: Params) =>
            {
                this.dataPage = params['page'];
                this.getData();
            }
        );
    }

    public sort(field,event?)
    {
        // Update the params
        if (this.dataQuery['sort'] === field)
        {
            this.dataQuery['direction'] = this.dataQuery['direction'] === 'asc' ? 'desc' : 'asc';
        }
        else
        {
            this.dataQuery['sort'] = field;
            this.dataQuery['direction'] = 'desc';
        }
        // Update the view
        if (typeof event !== 'undefined')
        {
            let ele = event.target || event.srcElement;
            let curTh = $(ele);
            if(curTh.prop('tagName') == 'A') curTh = curTh.parent();
            curTh.parent().find('span').remove();
            curTh.append('<span class="arrow '+this.dataQuery['direction']+'"></span>');
        }
        else
        {
            console.log('Hey dev! add the $event to the second param to have the arrows up/down');
        }

        this.getData();
    }

    public change(field,event)
    {
        let ele = event.target || event.srcElement;
        let curTb = $(ele);

        if(curTb.val() && curTb.val() != 'null')
        {
            this.dataFilter[field] = curTb.val();
        }
        else
        {
            delete this.dataFilter[field];
        }

        this.getData();

        // Remove the page params
        let href = window.location.href;
        let url  = href.split(';page=');
        history.pushState(null, null, url[0]);
    }

    public reset(event)
    {
        // Update the data
        this.dataFilter = {};
        this.getData();

        // Update the view
        let ele = event.target || event.srcElement;
        let curTh = $(ele);
        curTh.closest('tr').find('input,select').val('');
    }

    public delete(apiUrl,item)
    {
        let self = this;
        $.SmartMessageBox({
            title: "<i class='fa fa-trash' style='color:red'></i> Delete item confirmation",
            content: "Are you sure?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed)
        {
            if (ButtonPressed == "Yes")
            {
                self.app.post(apiUrl, {id: item.id}).then(response => {
                    if (response.status === 200){self.getData();}
                });
            }
        });
    }

    public setQuery(obj)
    {
        this.dataQuery = obj;
    }

    getData()
    {
        const paramsApi = this.generateQuery(this.dataFilter, this.dataPage, this.dataQuery);

        this.app.get(this.apiUrl, paramsApi).then(res =>
        {
            if (res.status === 200)
            {
                setTimeout(() => {this.result = res.json().data;}, 100);
            }
        });
    }

    generateQuery(filter:Object = {}, page:number = 1, paramsQuery:Object={})
    {
        let paramsDefault = {
            'paging': 1,
            'limit': 10,
        };
        let paramsMergeToDefault = {};
        let filterQuery = {};
        let paramsResult = {};
        for (let key in filter) {
            if (filter[key] != '[null]' && filter[key] != '') {
                filterQuery[key] = '*' + filter[key] + '*';
            }
        }
        Object.assign(paramsMergeToDefault, paramsDefault, paramsQuery);
        Object.assign(paramsResult, paramsMergeToDefault, filterQuery);
        paramsResult['page'] = page;

        return paramsResult;
    }
}