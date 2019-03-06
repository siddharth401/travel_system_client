import {Component, OnInit} from '@angular/core';
import {AppService} from "../app.service";

@Component({
    selector: 'sa-file-browser',
    templateUrl: 'file-browser.component.html'
})
export class FileBrowserComponent implements OnInit
{
    private listImage;
    private selectedItem;
    private listVariable;
    private result;

    constructor(
      private app:AppService
    ) {}

    ngOnInit()
    {
        this.getImage();
    }

    search(event)
    {
        let ele = event.target || event.srcElement;
        let tbSearch = $(ele);

        if(tbSearch.val() && tbSearch.val() != 'null')
        {
            this.getImage(tbSearch.val());
        }
        else
        {
            this.getImage();
        }
    }

    selectItem(item,event)
    {
        // Css selected
        $('.superbox-list').removeClass('selected');
        let ele = event.target || event.srcElement;
        $(ele).parent().addClass('selected');

        this.selectedItem = item;
        if(item.variable)
        {
            this.listVariable = item.variable;
        }

        this.result = this.selectedItem.path + this.selectedItem.name;
    }

    variableChange(event)
    {
        let ele = event.target || event.srcElement;
        let cbVariable = $(ele);

        if(cbVariable.val() != '--- Default ---')
        {
            this.result = this.selectedItem.path + this.selectedItem.name_short + '-' + cbVariable.val() + '.' + this.selectedItem.ext;
        }
        else
        {
            this.result = this.selectedItem.path + this.selectedItem.name;
        }
    }

    getImage(search?)
    {
        let params = {};
        if(search)
        {
            params['search'] = search;
        }

        this.app.get('medias/image',params).then(res =>
        {
            if (res.status === 200)
            {
                setTimeout(() =>
                {
                    this.listImage = res.json();
                    this.listVariable = {};
                    this.result = '';
                }, 100);
            }
        });
    }

    submit()
    {
        window['file-browser-input'].val(this.result);
        $('#file-browser').modal('toggle');
    }
}