import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";

@Component({
  selector: 'admin-flash',
  templateUrl: 'flash.component.html'
})
export class FlashComponent implements OnInit
{
  private show = false;
  private message = '';
  private type = '';

  constructor(private app: AppService){}

  ngOnInit()
  {
    let flash = this.app.getConfig('ADMIN-FLASH');
    if(flash)
    {
      flash = JSON.parse(flash);
      this.type = flash.type;
      this.message = flash.message;
      this.app.delConfig('ADMIN-FLASH');
      this.show = true;
    }
  }
}