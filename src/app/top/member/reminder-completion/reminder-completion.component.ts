import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
  selector: 'reminder-completion',
  templateUrl: './reminder-completion.component.html',
  styleUrls:['./reminder-completion.component.css']
})
export class ReminderCompletionComponent implements OnInit {
  private language_id = this.app.getConfig('TOP_LANG_ID');
  private languageName = this.app.getConfig('TOP_LANG');
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private app: AppService
  ) { }

  ngOnInit()
  {
    this.app.setTimeOutRedirectAuto();
  }

  btnClose(){
    this.router.navigate([this.languageName]);
  }
}
