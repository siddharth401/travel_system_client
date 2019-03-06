import { Component, OnInit } from '@angular/core';
import { AppService } from "../../shared/app.service";
import { ActivatedRoute } from '@angular/router';
import { Filter } from "../shared/filter/filter";

@Component({
  selector: 'user-list',
  templateUrl: './list.component.html',
})

export class ListComponent implements OnInit
{
  private filter;

  constructor
  (
      private app: AppService,
      private route: ActivatedRoute
  ) {}

  ngOnInit()
  {
    window.scrollTo(0,0);
    this.filter = new Filter(this.app,this.route,'users');
  }
}