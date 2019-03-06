import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {constant} from "../../../../shared/constant";
import {AppService} from "../../../../shared/app.service";

@Component({
    selector: 'favorites-layout-loadmore',
    templateUrl: './load-more.component.html'
})
export class FavoritesLoadmoreComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getConfig('TOP_LANG');
    @Input() public data;
    @Input() public url:string;
    constructor(
        private router: Router,
        private app: AppService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
    }

    loadMore(){
        if(this.data.last_page > this.data.current_page)
        {
            this.app.get(this.url,{page: this.data.current_page + 1, language_id: this.language_id, member_id: 1}).then(res => {
                if (res.status == 200) {
                    let data = res.json().data;
                    this.data.current_page = data.current_page;
                    this.data.last_page = data.last_page;
                    this.data.data = this.data.data.concat(data.data);
                }
            });
        }
    }


}
