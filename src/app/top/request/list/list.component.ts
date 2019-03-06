import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";
import { FormData} from "../../../shared/form-data";

@Component({
    selector: 'request-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    private params;
    private requests = {request_lists: {data:[],total:'',last_page: '', current_page: ''}};
    private conditions:any;
    private fb;
    private data = {
        city_prefix: '',
        category_prefix:[],
        language_prefix:'',
        date_plan:''
    };
    private last;
    private option;
    private currentLanguageID = this.app.getConfig('TOP_LANG_ID');

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        if (this.app.getConfig('confirmPlan')) {
            this.app.delConfig('confirmPlan');
        }
        window.scroll(0, 0);
        this.app.checkDisplayLanguage(this.app.language);
        /*this.getListDataFormSearch();*/
        this.setTitleAndDescription();

        this.fb = new FormData(this.app, this.data);
        this.route.params.subscribe((params) => {
            this.params = this.app.exportUrl(params);
            $('#sp-search-area').val(this.params.city_prefix);
            $('#search-category-plan').val(this.params.category_prefix[0]);
            this.conditions = this.params;
            this.getListRequest(this.params);
        });
        this.app.showCalendar();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("旅リクエストから探す　l　マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('旅ユーザーからの旅リクエスト一覧。あなたがガイドできるプランを提案してください。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getListRequest(params) {
        params['language'] = this.app.language;
        this.app.get('requests/list_requests', params).then(res =>
        {
            if (res.status == 200) {
                this.requests = res.json().data;
                if(res.json().data.conditions) {
                    this.getOptionsBreadCrumb(res.json().data.conditions);
                }
                if(res.json().data.conditions && res.json().data.conditions.date_plan) {
                    $('#input-date').val(res.json().data.conditions.date_plan[0]);
                }
            }
        });

    }

    searchRequest(city_prefix = null, category_prefix = null){
        let category = [];
        this.fb.form.value['category_prefix'] = category;
        if(category_prefix) {
            category.push(category_prefix);
        } else {
            $('input[name="category"]:checked').each(function(index,value) {
                category.push(value.id);
            });

        }
        this.fb.form.value['city_prefix'] =  city_prefix ? city_prefix : $('#search-area').val();
        this.fb.form.value['date_plan'] =  $('#input-date').val();
        this.fb.form.value['language_prefix'] = $('#search-language').val();
        this.fb.form.value['category_prefix'] = category;
        let url = this.app.genarateUrlSearchTour(this.fb.form.value);
        this.router.navigate([this.app.language+'/request/search'+url]);
    }

    getOptionsBreadCrumb(conditions) {
        var tmpOption = this.app.exportStringBreadCrumb(conditions);
        this.option = tmpOption[0];
        this.last = tmpOption[1];
    }

    loadMore(){
        this.route.params.subscribe((params) => {
            this.params = this.app.exportUrl(params);
            this.params['language'] = this.app.language;
            this.conditions = this.params;
            this.params['page'] = this.requests.request_lists.current_page + 1;
            if(this.requests.request_lists.last_page > this.requests.request_lists.current_page)
            {
                this.app.get('requests/list_requests',this.params).then(res => {
                    if (res.status == 200) {
                        let data = res.json().data.request_lists;
                        this.requests.request_lists.current_page = data.current_page;
                        this.requests.request_lists.last_page = data.last_page;
                        this.requests.request_lists.data = this.requests.request_lists.data.concat(data.data);
                    }
                });
            }

        });

    }

}
