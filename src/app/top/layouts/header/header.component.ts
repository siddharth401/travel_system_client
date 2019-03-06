import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'top-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit {

    public languages = [];

    private currentLanguage;
    public topLanguageId;
    private showselectlanguage = false;

    private language;
    private member_id;
    private language_id = this.app.top_lang_id;
    private data = {
        count_favorites :0,
        count_unreads :0,
        count_plans :0,
        count_requests :0,
        count_bookings :0,
        booking_guide : {booking_confirm_execute:'',booking_exist:'',booking_request_review:'',booking_waiting:''},
        booking_member:{booking_confirm_execute:'',booking_exist:'',booking_request_review:'',booking_waiting:''}
    };
    private curMember = this.app.curMember;

    constructor(
        private router: Router,
        private app:AppService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        $('.loadingRequest').hide();
        let curLang = this.app.getCurrentLanguage();
        this.member_id = this.curMember ? this.curMember.id : 1;
        this.language = this.route.snapshot.paramMap.get('language') ? this.route.snapshot.paramMap.get('language') : curLang;
        let topLangId = this.app.top_lang_id;
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
    }
    pageTop() {
        window.scroll(0, 0);
    }
    setLanguage(language)
    {
        this.topLanguageId = $("#selsect-language option:selected").attr("id");
        let currentLanguage = this.app.language;
        let last_top_lang_id = this.app.top_lang_id;
        let top_language = language != this.app.constant.DEFAULT_LANGUAGE_PREFIX ? language : this.app.constant.DEFAULT_LANGUAGE_URL;
        this.app.language = top_language;
        this.app.top_lang_id = this.topLanguageId;
        //set last current language with case not found record for switch language skip last language
        this.app.setConfig("LAST_TOP_LANG", currentLanguage);
        this.app.setConfig("LAST_TOP_LANG_ID", last_top_lang_id);
        this.showselectlanguage = false;
        this.app.setLanguage(top_language);
        this.app.event.emit({action: 'changeLanguage', lang: top_language});
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
