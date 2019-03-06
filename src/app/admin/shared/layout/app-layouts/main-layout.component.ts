import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {FadeZoomInTop} from "../../animations/fade-zoom-in-top.decorator";

@FadeZoomInTop()
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls:
  [
      '../../../../../assets/admin/css/bootstrap.min.css',
      '../../../../../assets/admin/css/font-awesome.min.css',
      '../../../../../assets/admin/css/smartadmin-production-plugins.min.css',
      '../../../../../assets/admin/css/smartadmin-production.min.css',
      '../../../../../assets/admin/css/smartadmin-skins.min.css',
      '../../../../../assets/admin/css/smartadmin-rtl.min.css',
      '../../../../../assets/admin/css/smartadmin-angular2.css',
      '../../../../../assets/admin/css/demo.min.css',
      '../../../../../assets/admin/css/your_style.css',
  ],
  encapsulation: ViewEncapsulation.None
})
export class MainLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}