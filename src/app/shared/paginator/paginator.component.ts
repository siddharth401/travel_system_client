import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from "../app.service";

@Component({
    selector: 'sa-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

    @Input() public data:any;
    @Input() public url:string;
    public show:number=7;

    constructor
    (
        private app: AppService,
        private router: Router
    ) {}

    ngOnInit() {
    }

    changeUrl(page) {
        window.scroll(0, 0);
        this.router.navigateByUrl(this.url+';page='+page);
    }

    generateStartPage(page:number=0)
    {
        this.show = 7;
        let currentPage = page>0?page:this.data.current_page;
        let startPage = 1;
        let halfShow = Math.floor(this.show/2);
        if (this.show > this.data.last_page) {
            this.show = this.data.last_page;
        }
        if (currentPage > halfShow) {
            if (currentPage > this.data.last_page-halfShow) {
                startPage = this.data.last_page-this.show+1;
            } else {
                startPage = currentPage-halfShow;
            }
        }
        if (startPage <= 0) {
            startPage = 1;
        }
        return startPage
    }

    generatePages(currentPage, lastPage) {
        let startPage = this.generateStartPage(currentPage);
        let result = [];
        
        for (let index = 0; index < this.show; index++) {
            let page = startPage+index;
            if (page <= lastPage) {
                result.push(page);
            }
        }
        return result;

    }

}
