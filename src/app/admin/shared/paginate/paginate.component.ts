import { Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { PaginateService } from './paginate.service';
import {Location} from '@angular/common';
import { URLSearchParams} from '@angular/http';

@Component({
  selector: 'paginate',
  templateUrl: './paginate.component.html'
})
export class PaginateComponent implements OnInit {

  @Input("totalItems") totalItems: number;
  @Input("currentPage") currentPage: number;
  @Input("pageSize") pageSize: number;
  pager: any = {};

  constructor(
    private paginateService: PaginateService, 
    private router: Router,
    private location: Location) {}

  ngOnInit() {
    if (this.currentPage < 1 || this.currentPage > Math.ceil(this.totalItems / this.pageSize)) {
      return;
    }
    this.pager = this.paginateService.getPager(this.totalItems, this.currentPage, this.pageSize);
  }

  choosePage(page: number) {
    let new_url;
    let params = new URLSearchParams(this.router.url);

    var ckPage = this.router.url.indexOf("?page");
    var ckAnd = this.router.url.indexOf("&");

    if(ckPage == -1){
      if(ckAnd == -1){
        new_url = this.router.url + '?page=' + page;
      } else {
        if(params.has('page') === true){
          params.set("page", page.toString());
        } else {
          params.append("page", page.toString());
        }
        new_url = params.toString();
      }
    } else {
      if(ckAnd == -1){
        var locationSquare = this.router.url.indexOf("=");
        new_url =  params.toString().substr(0,locationSquare+1) + page;
      } else {
        var locationSquare = this.router.url.indexOf("=");
        var firstPart = params.toString().substr(0,locationSquare+1);
        var lastPart = params.toString().substr(locationSquare+2, this.router.url.length);
        new_url = firstPart + page + lastPart;
      }
    }
    window.location.href = new_url
  }
}
