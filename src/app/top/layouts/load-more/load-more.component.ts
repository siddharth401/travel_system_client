import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {constant} from "../../../shared/constant";
import {AppService} from "../../../shared/app.service";

@Component({
    selector: 'layout-loadmore',
    templateUrl: './load-more.component.html'
})
export class LoadmoreComponent implements OnInit {

    @Input() public data;
    @Input() public url:string;
    @Input() public last_page;
    @Input() public current_page;

    constructor(
        private router: Router,
        private app: AppService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
    }

    loadMore(){
        let top_lang_id = this.app.getConfig('TOP_LANG_ID') ? this.app.getConfig('TOP_LANG_ID') : 1;
        let curMember = this.app.getCurrentMember();
        let curMemberId = curMember ? curMember.id : 1;
        if(this.data.last_page > this.data.current_page)
        {
            this.app.get(this.url,{page: this.data.current_page + 1, language_id: top_lang_id, member_id: curMemberId}).then(res => {
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
