import { Component, OnInit } from '@angular/core';
import { LayoutService } from "../../layout/layout.service";
import { AppService } from "../../../../shared/app.service";

@Component({
  selector: 'sa-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit
{
  constructor
  (
      private app: AppService,
      private layoutService: LayoutService
  ) {}

  ngOnInit()
  {

  }

  toggleShortcut() {
    this.layoutService.onShortcutToggle()
  }

}
