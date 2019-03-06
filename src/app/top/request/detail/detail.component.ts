import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'request-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
    private params = {
        id: '',
        language_id: this.app.getConfig('TOP_LANG_ID') ? this.app.getConfig('TOP_LANG_ID') : 1,
        page:1,
    };
    private curMember = this.app.getCurrentMember();
    private request_detail = {request_info: {dateEndWeek: '', datePlanWeek: '', createdAtWeek: '', is_favorite: 0, time_start: '', plan_hour: ''}, similarity_requests: {}, suggestions_request: {data:[],total:0,last_page: '', current_page: ''}};
    private similarity_requests;
    private language;
    private request_id;
    private listLanguage;
    private date_plan_str;
    private date_end_str;
    private created_at_str;
    private time_start_hour;
    private time_start_min;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        window.scrollTo(0,0);
        this.route.params.subscribe(params => {
            this.request_id = params['id'];
        });
        let lang = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : 'ja';
        this.app.checkDisplayLanguage(lang);
        this.language = this.app.getCurrentLanguage();
        this.getDetailRequest();
        this.getListLanguage();
    }

    setTitleAndDescription(title) {
        if(this.app.top_lang_id == this.app.constant.JA_LANGUAGE_ID) {
            this.app.setTitle(title+" | マッチングガイド - MATCHING GUIDE");
        } else {
            this.app.setTitle("The details of the travel request - MATCHING GUIDE");
        }

        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('旅ユーザーからの旅リクエスト詳細。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getDetailRequest() {
        this.params.id = this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id') : '';
        this.app.get('requests/request_detail', this.params).then(res =>
        {
            if (res && res.status == 200) {
                this.request_detail = res.json().data;
                //remove latest element of similary request
                this.similarity_requests = res.json().data.similarity_requests.length > 4 ? res.json().data.similarity_requests.slice(0, -1) : res.json().data.similarity_requests;
                this.setTitleAndDescription(res.json().data.request_info.title);
                //get hour and min from time start
                let time_start = this.request_detail.request_info.time_start.split(':');
                this.time_start_hour = time_start[0];
                this.time_start_min = time_start[1];
                this.date_end_str = this.request_detail.request_info.dateEndWeek ? this.app.getDayOfWeek(parseInt(this.request_detail.request_info.dateEndWeek)) : '';
                this.date_plan_str = this.request_detail.request_info.datePlanWeek ? this.app.getDayOfWeek(parseInt(this.request_detail.request_info.datePlanWeek)) : '';
                this.created_at_str = this.request_detail.request_info.createdAtWeek ? this.app.getDayOfWeek(parseInt(this.request_detail.request_info.createdAtWeek)) : '';
            } else {
                //get last current top language
                alert(this.app.ttrans("Currently, there is no data at  language that you chose."));
                this.router.navigate([this.language]);
            }
        });
    }

    favories(){
        if(this.request_detail.request_info.is_favorite == 0){
            this.app.post('top_commons/favorite/add',{id:this.request_id,model:2}).then(res=>{
                if(res.status == 200){
                    this.request_detail.request_info.is_favorite = 1;
                    this.app.number_on_header.count_favourites = this.app.number_on_header.count_favourites + 1;
                }else {
                    this.app.deleteFrontendStorage();
                    this.router.navigate(["/" + this.language + "/member/login"], { queryParams: { is_page: this.app.constant.REQUEST_DETAIL, id: this.request_id } });
                }
            });
        }else {
            this.app.post('top_commons/favorite/delete',{id:this.request_id,model:2}).then(res=>{
                if(res.status == 200){
                    this.request_detail.request_info.is_favorite = 0;
                    this.app.number_on_header.count_favourites = this.app.number_on_header.count_favourites - 1;
                }else {
                    this.app.deleteFrontendStorage();
                    this.router.navigate(["/" + this.language + "/member/login"], { queryParams: { is_page: this.app.constant.REQUEST_DETAIL, id: this.request_id } });
                }
            });
        }
    }

    getListLanguage(){
        this.app.get('languages',{'active':1, 'is_support': 1}).then(res=>{
            if(res.status == 200){
                this.listLanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }

    loadMore(){
        this.params.page = this.params.page+1;
        this.app.get('requests/request_detail', this.params).then(res =>
        {
            if (res && res.status == 200) {
                let data = res.json().data.suggestions_request;
                this.request_detail.suggestions_request.current_page = data.current_page;
                this.request_detail.suggestions_request.last_page = data.last_page;
                this.request_detail.suggestions_request.data = this.request_detail.suggestions_request.data.concat(data.data);
            } else {
                //get last current top language
                alert(this.app.ttrans("Currently, there is no data at  language that you chose."));
                this.router.navigate([this.language]);
            }
        });
    }

}
