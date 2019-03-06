import {Component, OnInit, ElementRef} from '@angular/core';
import {AppService} from "../app.service";

@Component({
    selector: 'sa-input-browser',
    templateUrl: 'input-browser.component.html'
})
export class InputBrowserComponent implements OnInit
{
    private tbInput;

    constructor(
      private app:AppService,
      private ele: ElementRef
    ) {}

    ngOnInit() {}

    ngAfterViewInit()
    {
        this.tbInput = $(this.ele.nativeElement).find('input');
    }

    browser()
    {
        window['file-browser-input'] = this.tbInput;
        $('#file-browser').modal('show');
    }

    show()
    {
        let img = $('<img>').attr('style','max-width:559px').attr('src',this.app.constant.FILE_URL + 'Media/' + this.tbInput.val());
        $('#file-browser-preview').find('.modal-body').html(img);
        $('#file-browser-preview').modal('show');
    }

    delete()
    {
        this.tbInput.val('');
    }
}