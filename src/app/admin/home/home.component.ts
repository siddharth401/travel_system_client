import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private listGuiderApproval;
  private listReviews = {data: [], current_page: 0, last_page: 0};
  private listMembers;
  private counterGuider = 0;
  private contentGuider = [];
  private limit_record = this.app.constant.LIMIT_RECORD_ADMIN_TOP;
  private length_list_guider = 0;
  
  private params_reviews = {
    page: 1,
    status: this.app.constant.BOOKING_REVIEW_CONFIRM
  };
  constructor(private app: AppService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getListMembers();
    this.getListGuider();
    this.getListReviews();
  }

  //get list member is waiting approval
  getListGuider() {
    this.app.get('members/list_top', {approve_guide: [this.app.constant.MEMBER_NOT_CONFIRM, this.app.constant.MEMBER_NOT_CARD], type: this.app.constant.MEMBER_GUIDER}).then(res =>
    {
      if (res.status == 200) {
        this.listGuiderApproval = res.json().data;
        this.length_list_guider = this.listGuiderApproval.length;
        this.loadMoreDataGuider(this.listGuiderApproval);
      }
    });
  }
  //get list reviews is waiting approval
  getListReviews() {
    this.app.get('plan_reviews/list_top', {status: this.app.constant.BOOKING_REVIEW_CONFIRM}).then(res =>
    {
      if (res.status == 200) {
        this.listReviews = res.json().data;
        console.log(this.listReviews);
      }
    });
  }
  getListMembers()
  {
    this.app.get('members').then(res =>
    {
      if (res.status == 200) {
        this.listMembers = this.app.arrToList(res.json().data, 'id','name');
      }
    });
  }
  //Load more data
  loadMoreDataGuider(data) {
      for(let i = this.counterGuider+1;i<=data.length;i++)
      {
        this.contentGuider.push(data[i-1]);
        if(i%this.limit_record==0) break;
      }
      this.counterGuider+=this.limit_record;
  }

  loadMoreReviews(){
    this.params_reviews['page'] = this.listReviews.current_page + 1;
    this.app.get('plan_reviews/list_top', this.params_reviews).then(res =>
    {
      if (res.status == 200) {
        let data = res.json().data;
        this.listReviews.current_page = data.current_page;
        this.listReviews.last_page = data.last_page;
        this.listReviews.data = this.listReviews.data.concat(data.data);
      }
    });

  }
}
