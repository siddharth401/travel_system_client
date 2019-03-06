import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { AppService } from '../../shared/app.service';
import { ActivatedRoute } from '@angular/router';
import { Filter } from "../shared/filter/filter";


@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private filter;
  @Output() modelChange = new EventEmitter();

  constructor(private app: AppService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    window.scrollTo(0,0);
    this.filter = new Filter(this.app, this.route, 'members');
  }

  onChange($event, id, value, i)
  {
      // this.modelChange.emit(value);
    console.log($event);
    if($event.screenX != 0 && $event.screenY != 0) {
      if (value == true) {
        if(confirm(this.app.trans("Do you want to de-active member？"))) {
          let data =
          {
            member_id: id
          };
          this.app.post('members/destroy', data).then(res => {
            if (res.status == 200) {
              this.filter.result.data[i].active = false;
            } else {
              $("#sa-active-" + id).click();
              alert(this.app.trans(res.json().message));
            }
          });
        }
      } else {
        if(confirm(this.app.trans("Do you want to active member？"))) {
          let data =
          {
            model: 'Member',
            id: id
          };
          this.app.post('commons/active', data).then(res => {
            if (res.status == 200) {
              this.filter.result.data[i].active = true;
            } else {
              $("#sa-active-" + id).click();
              alert(this.app.trans(res.json().message));
            }
          });
        }
      }
    }


  }

}