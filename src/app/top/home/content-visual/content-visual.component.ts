import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";
import { FormData} from "../../../shared/form-data";

@Component({
    selector: 'content-visual',
    templateUrl: './content-visual.component.html',
    styleUrls: ['./content-visual.component.css']
})
export class ContentVisualComponent implements OnInit {
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

    search(event) {
        this.fb.form.value.city_prefix = $("#city_prefix").val();
        this.fb.form.value.language_prefix = $("#language_prefix").val();
        this.fb.form.value.date_plan = $("#input-date").val();
        this.fb.form.value.category_prefix = $("#category_prefix").val();
        if(this.fb.form.value.category_prefix) {
            let category = [];
            category.push(this.fb.form.value.category_prefix);
            this.fb.form.value.category_prefix = category;
        }
        var url = this.app.genarateUrlSearchTour(this.fb.form.value);
        this.router.navigate([this.language+'/search/'+url]);
    }
}
