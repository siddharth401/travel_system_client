import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'slide-menu',
    templateUrl: './slide-menu.component.html',
})
export class SlideMenuComponent implements OnInit {
    public languages = [];

    private currentLanguage;
    public topLanguageId;
    private showselectlanguage = false;

    private curMember = this.app.curMember;
    private number_on_header = this.app.number_on_header;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        let topLangId = this.app.getConfig('TOP_LANG_ID');
        this.topLanguageId = topLangId ? topLangId : this.app.constant.TOP_LANGUAGE_ID;
        this.app.setConfig('TOP_LANG_ID', this.topLanguageId);
        this.languages = this.app.languages;
    }

    addClassIsActive() {
        $(".user-menu").toggleClass('is-active');
        $("#overlay-menu").slideToggle();
        $(".user-menu").next('ul').slideToggle();
    }

    overlay() {
        $(".user-menu").removeClass('is-active');
        $("#overlay-menu").slideToggle();
        $(".user-menu").next('ul').slideToggle();
    }
    removeOverlay() {
        $(".user-menu").removeClass('is-active');
        $("#overlay-menu").slideToggle();
        $(".user-menu").next('ul').slideToggle();
        //$(".sb-left").removeClass('sb-active');
    }

    setLanguage(language)
    {
        let currentLanguage = this.app.language;
        let last_top_lang_id = this.app.top_lang_id;
        //set last current language with case not found record for switch language skip last language
        this.app.setConfig("LAST_TOP_LANG", currentLanguage);
        this.app.setConfig("LAST_TOP_LANG_ID", last_top_lang_id);
        let top_language = language != this.app.constant.DEFAULT_LANGUAGE_PREFIX ? language : this.app.constant.DEFAULT_LANGUAGE_URL;
        this.topLanguageId = language != this.app.constant.DEFAULT_LANGUAGE_PREFIX ? this.app.constant.EN_LANGUAGE_ID : this.app.constant.JA_LANGUAGE_ID;
        this.showselectlanguage = false;
        this.app.setLanguage(top_language);
        this.app.event.emit({action: 'changeLanguage', lang: language});
        //get list top my page when switch language
        if(this.curMember) {
            this.app.getListTopMyPage(this.curMember.id);
        }

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

    login() {
        let previous_login_url = window.location.pathname;
        this.app.setConfig('PREVIOUS_LOGIN_URL', previous_login_url);
        this.router.navigate([this.app.language + '/member/login']);
    }
}
