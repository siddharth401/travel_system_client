import { Component, OnInit } from '@angular/core';
import { AppService } from "../../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';
import {Filter} from "../../admin/shared/filter/filter";
import { FormData} from "../../shared/form-data";

@Component({
    selector: 'list-tour',
    templateUrl: './list.component.html',
    styleUrls: [
        '../../../assets/top/css/search.css',
        './list.component.css'
    ]
})

export class ListComponent implements OnInit {
    public listPlans={data:[],total:'',last_page: '', current_page: ''};
    private conditions:any;
    private params = {
        city_prefix: '',
        category_prefix: [],
        language_prefix: '',
        date_plan: '',
        sort: ''
    };
    private currentLanguageID = this.app.getConfig('TOP_LANG_ID');
    private fb;
    private data = {
        city_prefix: '',
        category_prefix:[],
        language_prefix:'',
        date_plan:'',
        sort: ''
    };
    private language = this.app.getCurrentLanguage();
    private last;
    private option;


    constructor
    (private app: AppService,
     private route: ActivatedRoute,
     private router: Router) {
    }

    ngOnInit() {
        window.scroll(0,0);
        let lang = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : 'ja';
        this.app.checkDisplayLanguage(lang);
        this.fb = new FormData(this.app, this.data);
        this.route.params.subscribe((params) => {
            this.params = this.app.exportUrl(params);
            $('#sp-search-area').val(this.params.city_prefix);
            $('#search-category-plan').val(this.params.category_prefix[0]);
            this.conditions = this.params;
            this.getListTours(this.params);
        });
        this.app.showCalendar();
    }

    setTitleAndDescription(conditions) {
        //sort again array conditions with language, date_plan, city, category
        let array_conditions = this.app.constant.TitleParams;
        array_conditions.language = conditions.language;
        array_conditions.date_plan = conditions.date_plan;
        array_conditions.city = conditions.city;
        array_conditions.category = conditions.category;
        let title = this.language == this.app.constant.EN_LANGUAGE_URL ? this.app.exportStringEnglishTitleDescription(array_conditions, true) : this.app.exportStringTitleDescription(array_conditions, true);
        let description = this.language == this.app.constant.EN_LANGUAGE_URL ? this.app.exportStringEnglishTitleDescription(array_conditions, false) : this.app.exportStringTitleDescription(array_conditions, false);
        this.app.setTitle(title);
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: description}
        ]);
    }

    getListTours(params) {
        // footer click link
        let city_name = '';
        $.each(this.app.listDataFormSearch.cities,function (index,value) {
            $.each(value.cities,function (key,val) {
                if(val.prefix == params.city_prefix){
                    city_name = val.name;
                }
            });
            $("#select2-search-area-container").text(city_name);
        });

        let lang = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : 'ja';
        params['language'] = lang;
        this.app.get('top_commons/search', params).then(res => {
            if(res.status == 200){
                this.listPlans = res.json().data.plans;
                if(res.json().data.conditions) {
                    this.getOptionsBreadCrumb(res.json().data.conditions);
                    this.setTitleAndDescription(res.json().data.conditions);
                }
                if(res.json().data.conditions && res.json().data.conditions.date_plan) {
                    $('#input-date').val(res.json().data.conditions.date_plan[0]);
                }
            }
        });
    }
    searchTour() {
        let category = [];
        this.fb.form.value['category_prefix'] = category;
        $('input[name="category"]:checked').each(function(index,value) {
            category.push(value.id);
        });
        this.fb.form.value['city_prefix'] =  $("#search-area").val();
        this.fb.form.value['date_plan'] =  $('#input-date').val();
        this.fb.form.value['language_prefix'] = $('#search-language').val();
        this.fb.form.value['category_prefix'] = category;
        this.fb.form.value['sort'] = $('#search-sort').val();
        let url = this.app.genarateUrlSearchTour(this.fb.form.value);
        this.router.navigate([this.language+'/search/'+url]);
    }

    getOptionsBreadCrumb(conditions) {
        var tmpOption = this.app.exportStringBreadCrumb(conditions);
        this.option = tmpOption[0];
        this.last = tmpOption[1];
    }
    loadMore(){
        this.route.params.subscribe((params) => {
            this.params = this.app.exportUrl(params);
            this.params['language'] = $('#selsect-language').val();
            this.conditions = this.params;
            this.params['page'] = this.listPlans.current_page + 1;
            if(this.listPlans.last_page > this.listPlans.current_page)
            {
                this.app.get('top_commons/search',this.params).then(res => {
                    if (res.status == 200) {
                        let data = res.json().data.plans;
                        this.listPlans.current_page = data.current_page;
                        this.listPlans.last_page = data.last_page;
                        this.listPlans.data = this.listPlans.data.concat(data.data);
                        this.listPlans.total = res.json().data.plans.total;
                    }
                });
            }

        });

    }

}