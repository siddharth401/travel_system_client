import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../shared/app.service";
import {constant} from "../../shared/constant";

@Component({
  selector: 'guide',
  templateUrl: './guide.component.html',
  styleUrls:['./guide.component.css',
    '../../../assets/top/css/guide.css',]
})
export class GuideComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private app: AppService
  ) { }
  private FILE_URL = constant.FILE_URL;
  public data={data:[],total:'',last_page: '', current_page: ''};
  private current_page;
  private language_id = this.app.getConfig('TOP_LANG_ID');
  private language = this.app.getCurrentLanguage();

  ngOnInit()
  {
    window.scroll(0,0);
    this.getListGuideReview();
    this.setTitleAndDescription();
    this.app.checkDisplayLanguage(this.language);
  }

  setTitleAndDescription() {
    this.app.setTitle(this.app.ttrans('旅ガイドから探す　l　マッチングガイド - MATCHING GUIDE'));
    $("meta[name='description']").remove();
    this.app.setMeta([
      {name: 'description', content: this.app.ttrans('旅ガイド一覧です。気になるガイドを探してみよう。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
    ]);
  }

  getListGuideReview() {
    this.app.get('top_guider/guider_lists').then(res => {
      if (res.status == 200) {
        this.data = res.json().data;
      }
    });
  }
}
