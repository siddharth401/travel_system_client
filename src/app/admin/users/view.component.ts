import { Component, OnInit } from '@angular/core';
import { AppService } from "../../shared/app.service";
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'view-user',
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {
  private user = {};

  constructor(
    private app: AppService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.app.get('users/detail', {id: +params['id']}))
      .subscribe(response => {
        if(response.status == 200)
        {
          this.user = response.json().data;
        }
      });
  }

  goBack(): void {
    this.location.back();
  }

}
