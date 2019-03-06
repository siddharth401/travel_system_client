import { Component, OnInit } from '@angular/core';
import { AppService} from '../../../shared/app.service';
import { ActivatedRoute } from '@angular/router';
import { Filter } from "../../shared/filter/filter";

@Component({
  selector: 'admin-test-type-list',
  templateUrl: './test-type-list.component.html'
})
export class TestTypeListComponent implements OnInit
{
  private filter;

  constructor
  (
    private app: AppService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit()
  {
    this.filter = new Filter(this.app,this.route,'tmp_test_types',{limit:3});
  }
}
