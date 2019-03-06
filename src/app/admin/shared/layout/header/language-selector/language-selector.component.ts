import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import { AppService } from "../../../../../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'sa-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: [
    './language-selector.component.css'
  ]
})
export class LanguageSelectorComponent implements OnInit {

  public languages: any = [
    {
      "key": "us",
      "alt": "English",
      "title": "English",
      "id": this.app.constant.EN_LANGUAGE_ID
    },
    {
      "key": "jp",
      "alt": "Japan",
      "title": "日本語",
      "id": this.app.constant.JA_LANGUAGE_ID
    }
  ];

  public currentLanguage: any;
  private showselectlanguage = false;

  constructor(
      private app:AppService,
      private router:Router
  ) {}

  ngOnInit() {
    let curLang = this.app.getConfig('LANG','us');
    let backend_lang_id = curLang == 'us' ? this.app.constant.EN_LANGUAGE_ID : this.app.constant.JA_LANGUAGE_ID;
    this.app.setConfig('BACKEND_LANG_ID',backend_lang_id);
    this.currentLanguage = this.languages.find((it)=>
    {
      return it.key == curLang;
    });
  }

  setLanguage(language)
  {
    this.showselectlanguage = false;
    this.currentLanguage = language;
    this.app.setConfig('LANG',language.key);
    this.app.setConfig('BACKEND_LANG_ID',language.id);
    this.app.backend_language_id = this.app.getConfig('BACKEND_LANG_ID');
    this.app.curLang = language.key;
    this.app.event.emit({action: 'changeLanguage', lang: language.key})
    // this.router.navigate(['admin/home']);
  }

  showSelect() {
    this.showselectlanguage = true;
  }

}
