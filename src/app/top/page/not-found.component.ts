
import { Component, OnInit } from '@angular/core';
// import { AppService } from "../../../shared/app.service";

@Component({
  selector: 'top-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(
      // private app: AppService
  ) { }


  ngOnInit() {
    // this.app.checkDisplayLanguage(this.app.language);
    $(document).ready(function () {
        $(".header").css("background", "rgba(0, 0, 0, 0.7)");
    });
  }

}
