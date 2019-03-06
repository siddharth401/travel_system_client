import {Component, OnInit, Input, EventEmitter} from '@angular/core';
import { AppService } from "../../../../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'top-language-display',
    templateUrl: './language-display.component.html',
    styleUrls: ['./language-display.component.css']
})
export class LanguageDisplayComponent implements OnInit {
    
    public languages = [];

    private currentLanguage;
    public topLanguageId;
    private showselectlanguage = false;

    constructor(
        private app:AppService,
        private router:Router,
        private route:ActivatedRoute
    ) {}

    ngOnInit() {
        let topLangId = this.app.getConfig('TOP_LANG_ID');
        this.topLanguageId = topLangId ? topLangId : this.app.constant.TOP_LANGUAGE_ID;
        this.app.setConfig('TOP_LANG_ID', this.topLanguageId);
        this.languages = this.app.languages;
    }

    setLanguage(language)
    {
        let currentLanguage = this.app.language;
        let last_top_lang_id = this.app.top_lang_id;
        //set last current language with case not found record for switch language skip last language
        this.app.setConfig("LAST_TOP_LANG", currentLanguage);
        this.app.setConfig("LAST_TOP_LANG_ID", last_top_lang_id);
        let top_language = language != this.app.constant.DEFAULT_LANGUAGE_PREFIX ? language : this.app.constant.DEFAULT_LANGUAGE_URL;
        this.topLanguageId = $("#selsect-language option:selected").attr("id")
        this.showselectlanguage = false;
        //this.app.setLanguage(top_language, this.topLanguageId);
        this.app.event.emit({action: 'changeLanguage', lang: language});

        //replace language on url after switch new language
        let curUrl = window.location.href;
        let pathname = new URL(curUrl).pathname;
        let params = pathname .split( '/' );
        if(currentLanguage) {
            params[1] = top_language;
        } else {
            params[0] = top_language;
        }
        let length = params.length;
        let url = "";
        for(let i = 0; i < length; i++) {
            if(params[i]) {
                url += params[i]+'/';
            }
        }

        this.router.navigate([url]);
    }

}
