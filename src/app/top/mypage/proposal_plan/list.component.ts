import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';

@Component({
    selector: 'mypage-plan-create',
    templateUrl: './list.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './list.component.css'
    ]
})
export class ListComponent implements OnInit {
    // private data: any;
    public data={data:[],total:'',last_page: '', current_page: ''};
    private loadData = true;
    private date_search = '';

    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.language;
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        if(this.app.curMember) {
            window.scroll(0,0);
            this.app.checkDisplayLanguage(this.languageName);
            this.app.get('mypage/list_suggest_plan',{language_id:this.language_id}).then(res=>{
                if(res.status == 200) {
                    this.data = res.json().data;
                    if(res.json().data.data.length == 0){
                        this.loadData = false;
                    }
                } else {
                    alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                    this.router.navigate([this.app.language]);
                }
            });
            this.setTitleAndDescription();
            this.date_search = $('#input-date').val();
        }

    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - the list of  the travell request proposal - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page - the list of  the travel request proposals."MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

    loadMore(){
        if(parseInt(this.data.last_page) > 1)
        {
            let date_plan = $('#input-date').val();
            let status = $('#status-teian').val();
            if(date_plan == '日付' || date_plan == 'Date'){
                date_plan = '';
            }
            this.app.get('mypage/list_suggest_plan',{page: this.data.current_page + 1, language_id: this.language_id,date_plan:date_plan,status:status}).then(res => {
                if (res.status == 200) {
                    let data = res.json().data;
                    this.data.current_page = data.current_page;
                    this.data.last_page = data.last_page;
                    this.data.data = this.data.data.concat(data.data);
                }
            });
        }
    }

    search(){
        let date_plan = $('#input-date').val();
        let status = $('#status-teian').val();
        if(date_plan == '日付' || date_plan == 'Date'){
            date_plan = '';
        }
        this.app.get('mypage/list_suggest_plan',{language_id:this.language_id,date_plan:date_plan,status:status}).then(res=>{
            if(res.status == 200){
                this.data = res.json().data;
                if(res.json().data.data.length == 0){
                    this.loadData = false;
                }
            }
        });

    }

}

