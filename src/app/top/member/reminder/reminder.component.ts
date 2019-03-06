import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
  selector: 'reminder',
  templateUrl: './reminder.component.html',
  styleUrls:['./reminder.component.css']
})
export class ReminderComponent implements OnInit {
  private language_id = this.app.getConfig('TOP_LANG_ID');
  private languageName = this.app.getConfig('TOP_LANG');
  private error = {};
  private data = {'email' : ''};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private app: AppService
  ) { }

  ngOnInit()
  {
  }

  sendMail(){
    this.data.email = $('.email').val().trim();
    this.app.post('members/resetPassword', this.data).then(res => {
      if(res.status == 200){
        this.router.navigate([this.languageName + '/member/login/reminder/completion']);
      } else {
        this.error = res.json();
      }
    });
  }
  ngAfterViewChecked() {
    // ...
    if($('.email').val() == ''){
      // $('.change-pass').disable();
      $('#changePass').hide();
      $('#disable-button').show();
    }else {
      $('#disable-button').hide();

      $('#changePass').show();

    }
  }

  changeButton(){
    $('#disable-button').hide();

    $('#changePass').show();

  }

  btnClose(){
    this.router.navigate([this.languageName]);
  }
}
