import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {FadeZoomInTop} from "../../animations/fade-zoom-in-top.decorator";

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls:
  [
    '../../../../../assets/admin/css/bootstrap.min.css',
    '../../../../../assets/admin/css/font-awesome.min.css',
    '../../../../../assets/admin/css/smartadmin-production-plugins.min.css',
    '../../../../../assets/admin/css/smartadmin-production.min.css',
    //'../../../../../assets/admin/css/smartadmin-skins.min.css',
    //'../../../../../assets/admin/css/smartadmin-rtl.min.css',
    //'../../../../../assets/admin/css/smartadmin-angular2.css',
    //'../../../../../assets/admin/css/demo.min.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AuthLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
