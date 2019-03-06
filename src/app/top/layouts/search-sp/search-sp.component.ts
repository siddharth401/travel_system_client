import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";
import { FormData} from "../../../shared/form-data";

@Component({
    selector: 'search-sp',
    templateUrl: './search-sp.component.html',
})
export class SearchSpComponent implements OnInit {
    private fb;
    private data = {
        city_prefix: '',
        category_prefix:'',
        language_prefix:'',
        date_plan:''
    };
    private language = this.app.getCurrentLanguage();
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.fb = new FormData(this.app, this.data);
        this.app.showCalendar();
    }

    search() {
        this.fb.form.value.city_prefix = $("#sp-search-area").val();
        this.fb.form.value.language_prefix = $("#search-lang").val();
        this.fb.form.value.date_plan = $("#sp-search-date").val();
        this.fb.form.value.category_prefix = $("#search-category-plan").val();
        if(this.fb.form.value.category_prefix) {
            let category = [];
            category.push(this.fb.form.value.category_prefix);
            this.fb.form.value.category_prefix = category;
        }
        var url = this.app.genarateUrlSearchTour(this.fb.form.value);

        // hide popup where click button search
        $('div.search--sp').slideToggle();
        $('.header__search-trigger').toggleClass('is-active');

        // redirect to URL of page search
        //check search for plan or request
        var curUrl = window.location.href;
        let is_request_search = curUrl.indexOf("request/search");
        if(is_request_search > 0) {
            this.router.navigate([this.language+'/request/search'+url]);
        } else {
            this.router.navigate([this.language+'/search/'+url]);
        }
    }
}
