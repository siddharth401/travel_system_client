import { Component, OnInit } from '@angular/core';
import { AppService } from './shared/app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';


  constructor(private app: AppService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    var curUrl = window.location.href;
    let is_admin = curUrl.indexOf("admin");
    //Add title on admin page
    this.addTitle(is_admin);
    let is_page = curUrl.indexOf("page");
    let is_sort = curUrl.indexOf("sort");
    let is_redirect = curUrl.indexOf("redirect");
    this.checkAddMeta(is_page, is_sort, is_redirect);
  }

  checkAddMeta(is_page, is_sort, is_redirect) {
    if(is_page > 0) {
      //remove robots if this is exist
      this.app.removeMetaTag();
      // add meta noindex, follow with paging page bigger 1
      this.app.setMetaIndex("noindex,follow");
    }
    if(is_sort > 0) {
      //add robots with noindex, follow if this is exist
      this.app.removeMetaTag();
      // add meta noindex, follow with sort
      this.app.setMetaRobots("noindex,follow");
    }
    if(is_redirect > 0) {
      //remove robots if this is exist
      this.app.removeMetaTag();
      // add meta noindex, nofollow with redirect page
      this.app.setMetaRobots("noindex,nofollow");
    }
  }
  addTitle(is_admin) {
    if(is_admin > 0) {
      this.app.setTitle('ガイドマッチング管理画面');
    } else {
      this.app.setTitle('あなただけの旅とガイドを見つけよう｜マッチングガイド - MATCHING GUIDE');
    }
  }

}
