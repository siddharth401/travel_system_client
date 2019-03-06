import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../shared/app.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls:['./home.component.css']
})
export class HomeComponent implements OnInit {

  private language = this.app.getCurrentLanguage();
  private language_id = this.app.getConfig('TOP_LANG_ID');
  private listLanguage = [];
  private topData;
  private curMember = this.app.getCurrentMember();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private app: AppService
  ) { }

  ngOnInit()
  {
    let lang = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : '';
    this.app.checkDisplayLanguage(lang);
    this.setTitleAndDescription();
    this.getData();
  }  

  getData() {
    this.app.get('top', {language_id: this.language_id}).then(res =>
    {
      if (res.status == 200) {
        this.topData = res.json().data;
      }
    });
  }

  setTitleAndDescription() {
    this.app.setTitle(this.app.ttrans("あなただけの旅とガイドを見つけよう　l　マッチングガイド - MATCHING GUIDE"));
    $("meta[name='description']").remove();
    this.app.setMeta([
      {name: 'description', content: this.app.ttrans('マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
    ]);
  }
}
