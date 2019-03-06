import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../shared/app.service';
import { ActivatedRoute } from '@angular/router';
import { Filter } from "../../shared/filter/filter";

@Component({
  selector: 'admin-test-list',
  templateUrl: './test-list.component.html'
})
export class TestListComponent implements OnInit
{
  private filter;

  constructor
  (
    private app: AppService,
    private route: ActivatedRoute
  ) { }

  ngOnInit()
  {
    this.filter = new Filter(this.app,this.route,'tmp_tests');
  }
}