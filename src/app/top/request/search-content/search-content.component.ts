import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import { FormData} from "../../../shared/form-data";

@Component({
    selector: 'request-search-content',
    templateUrl: './search-content.component.html',
    styleUrls: ['./search-content.component.css']
})
export class SearchContentComponent implements OnInit {
    private currentLanguage;
    private listCountry;
    private listPrefecture = [];
    private listCategory = [];
    private languageSupport = [];
    private currentLanguageID = this.app.getConfig('TOP_LANG_ID');
    private fb;
    private data = {
        prefecture_id: '',
        category_id:[],
        date_plan:'',
        language_id:''
    };
    private language;

    constructor(private app: AppService,
                private router: Router) {
    }

    ngOnInit() {
        this.fb = new FormData(this.app, this.data);
        this.getListDataFormSearch();
        this.language = this.app.getConfig('TOP_LANG') ? this.app.getConfig('TOP_LANG') : 'ja';
        this.app.checkDisplayLanguage(this.language);

    }

    getListDataFormSearch() {
        this.app.get('top_commons/data_search', {language_id: this.currentLanguageID}).then(res => {
            if (res.status === 200) {
                this.listPrefecture = res.json().data.prefectures;
                this.listCategory = res.json().data.categories;
                this.languageSupport = res.json().data.languages;
            }
        });
    }
    searchTour(){
        let category = [];
        $('input[name="category"]:checked').each(function(index,value) {
            category.push(value.prefix);
        });
        this.fb.form.value['prefecture_id'] =  $('#search-area').val();
        this.fb.form.value['date_plan'] =  $('#input-date').val();
        this.fb.form.value['language_id'] = $('#search-language').val();
        this.fb.form.value['category_id'] = category;
        let lang = this.app.getConfig('TOP_LANG');
        let url = this.app.genarateUrlSearchTour(this.fb.form.value);
        this.router.navigate([lang+'/request/'+url]);

    }

}
