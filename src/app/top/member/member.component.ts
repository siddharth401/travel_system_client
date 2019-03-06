import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../shared/app.service";

@Component({
  selector: 'member',
  templateUrl: './member.component.html',
  styleUrls:['./member.component.css']
})
export class MemberComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private app: AppService
  ) { }

  ngOnInit()
  {
    let curLang = this.app.getConfig('TOP_LANG') ? this.app.getConfig('TOP_LANG') : this.app.getConfig('TOP_LANG', 'ja');
    // this.language = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : curLang;

    

  }
}
