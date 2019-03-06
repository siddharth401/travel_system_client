import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AppService} from "../../../shared/app.service";

@Component({
  selector: 'member-layout',
  templateUrl: './member-layout.component.html',
  styleUrls:
     [
     '../../../../assets/top/css/themes/default.css',
     '../../../../assets/top/css/themes/default.date.css',
     '../../../../assets/top/css/slidebars.min.css',
     '../../../../assets/top/css/colorbox.css',
     '../../../../assets/top/css/global.css',
     '../../../../assets/top/css/index.css',
   ],
  encapsulation: ViewEncapsulation.None
})
export class MemberLayoutComponent implements OnInit {

  constructor(private app: AppService) { }

  ngOnInit() {
  }

}
