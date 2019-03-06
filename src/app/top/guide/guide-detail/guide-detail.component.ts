import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";
import {constant} from "../../../shared/constant";

@Component({
  selector: 'guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrls:['./guide-detail.component.css',
    '../../../../assets/top/css/guide.css',]
})
export class GuideDetailComponent implements OnInit {
  private language_id = this.app.getConfig('TOP_LANG_ID');
  private language = this.app.getCurrentLanguage();
  private data = {guider :{is_favorite:0},tours:{last_page:'',current_page:'',data:[]}};
  private reviews = {last_page:'',current_page:'',data:[],total:''};
  private FILE_URL = constant.FILE_URL;
  private guider_id;
  private listCities  = {};
  private number_on_header = this.app.number_on_header;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private app: AppService
  ) { }

  ngOnInit()
  {
    window.scroll(0,0);
    this.route.params.subscribe(params => {
      this.guider_id = params['id'];
      this.getListDetailMember();
      this.getListReviewMember();
    });
    this.setTitleAndDescription();
    this.app.checkDisplayLanguage(this.language);
  }

  setTitleAndDescription() {
    this.app.setTitle(this.app.ttrans("旅ガイド詳細　l　マッチングガイド - MATCHING GUIDE"));
    $("meta[name='description']").remove();
    this.app.setMeta([
      {name: 'description', content: this.app.ttrans('旅ガイド一覧です。気になるガイドを探してみよう。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
    ]);
  }

  getListDetailMember(){
      this.app.get('top_guider/detail', {guider_id: this.guider_id,language_id: this.language_id}).then(res =>
      {
        if (res.status === 200) {
          this.data = res.json().data;
        }
      });
  }

  getListReviewMember(){
      this.app.get('top_guider/member_review', {guider_id: this.guider_id,language_id: this.language_id}).then(res =>
      {
        if (res.status === 200) {
          this.reviews = res.json().data;
        }
      });
  }

  loadMoreTour(){
    if(this.data.tours.last_page > this.data.tours.current_page)
    {
      this.app.get('top_guider/detail', {page: this.data.tours.current_page + 1,guider_id: this.guider_id,language_id: this.language_id}).then(res => {
        if (res.status == 200) {
          let data = res.json().data.tours;
          this.data.tours.current_page = data.current_page;
          this.data.tours.last_page = data.last_page;
          this.data.tours.data = this.data.tours.data.concat(data.data);
        }
      });
    }
  }

  loadMoreReview(){
    if(this.reviews.last_page > this.reviews.current_page)
    {
      this.app.get('top_guider/member_review', {page: this.reviews.current_page + 1,guider_id: this.guider_id,language_id: this.language_id}).then(res => {
        if (res.status == 200) {
          let data = res.json().data;
          this.reviews.current_page = data.current_page;
          this.reviews.last_page = data.last_page;
          this.reviews.data = this.reviews.data.concat(data.data);
        }
      });
    }
  }

  favories(){
      if(this.data.guider.is_favorite == 0){
        this.app.post('top_commons/favorite/add',{id:this.guider_id,model:3}).then(res=>{
          if(res.status == 200){
            this.data.guider.is_favorite = 1;
            this.app.number_on_header.count_favourites = this.app.number_on_header.count_favourites + 1;
            $('.sp-favorite').addClass('favorite--active');
          }else {
            this.app.deleteFrontendStorage();
            this.router.navigate(["/" + this.language + "/member/login"], { queryParams: { is_page: this.app.constant.GUIDE_DETAIL, id: this.guider_id } });
          }
        });
      }else {
        this.app.post('top_commons/favorite/delete',{id:this.guider_id,model:3}).then(res=>{
          if(res.status == 200){
            this.data.guider.is_favorite = 0;
            this.app.number_on_header.count_favourites = this.app.number_on_header.count_favourites - 1;
            $('.sp-favorite').removeClass('favorite--active');
          }else {
            this.app.deleteFrontendStorage();
            this.router.navigate(["/" + this.language + "/member/login"], { queryParams: { is_page: this.app.constant.GUIDE_DETAIL, id: this.guider_id } });
          }
        });
      }
  }

  rating(number) {
    let tmp = Math.ceil(number);
    let result = [];
    for (var i = 1;  i <= tmp; i++)
    {
      var value = true;
      if(i === tmp && tmp > number)
      {
        value = false;
      }
      result.push({key: value})
    }
    return result;
  }
}
