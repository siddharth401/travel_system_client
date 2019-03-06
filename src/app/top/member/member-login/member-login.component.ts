import {Component, Inject, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AppService} from "../../../shared/app.service";
import {DOCUMENT} from "@angular/platform-browser";
import { AuthService } from "angular4-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";


@Component({
    selector: 'member-login',
    templateUrl: './member-login.component.html',
    styleUrls: ['./member-login.component.css']
})
export class MemberLoginComponent implements OnInit {
    private data = {'password': '', 'email': ''};
    private Error;
    private Error_Facebook;
    private Error_from_facebook;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private dataFb = {'authToken':''};

    constructor(private router: Router,
                private route: ActivatedRoute,
                private app: AppService,
                public _auth: AuthService,
                @Inject(DOCUMENT) private _document,
                private _renderer2: Renderer2,
                private authService: AuthService
    ) {
    }

    ngOnInit() {
        $( ".btn--primary" ).click(function() {
            $("#email" ).focus();
            $(".add__form-item input" ).addClass( "border" );
        });
        $('.loadingRequest').hide();
        if(this.app.getCurrentMember()){
            this.router.navigate(['/']);
        }else {
            this.authService.signOut();
        }
        $(".toggle-password").click(function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });
        this.setTitleAndDescription();
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('新規会員登録　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('新規会員登録です。Facce bookのIDやメールアドレスで簡単に登録できます。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    saveData() {
        this.data.email = $('.email').val().trim();
        this.data.password = $('.password').val();
        var isMobile = window.matchMedia("only screen and (max-width: 760px)");
        this.app.post('members/login', this.data).then(res => {
            if (res.status == 200) {
                let data = res.json();
                this.app.setConfig('TOP_TOKEN', data.top_token);
                this.app.setConfig('CURRENT_MEMBER', JSON.stringify(data.profile));
                let is_page = this.route.snapshot.queryParams["is_page"];
                let id = this.route.snapshot.queryParams["id"] ? this.route.snapshot.queryParams["id"] : null;
                let member_id = this.route.snapshot.queryParams["member_id"] ? this.route.snapshot.queryParams["member_id"] : null;
                let url = is_page ? this.app.goToPageAfterLogin(is_page, id,member_id) : "";
                var newURL = window.location.protocol + "//" + window.location.host + "/" + this.app.language + url;
                if (isMobile.matches) {
                    window.location.href = newURL;
                } else {
                    this.router.navigate([this.app.language + url]);
                }
            }
            else {
                this.Error = res.json();
                this.Error_Facebook = '';
                this.Error_from_facebook = '';
            }
        });
    }

    btnClose() {
        var newURL = window.location.protocol + "//" + window.location.host + "/" + this.app.language;
        var isMobile = window.matchMedia("only screen and (max-width: 760px)");

        if (isMobile.matches) {
            window.location.href = newURL;
        } else {
            this.router.navigate([this.app.language]);
        }
    }



    signIn()
    {
        var isMobile = window.matchMedia("only screen and (max-width: 760px)");
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user=>{
            this.dataFb.authToken =  user.authToken;
            if(this.dataFb.authToken != ''){
                this.app.get('members/facebook/login', this.dataFb).then(res => {
                    if (res.status == 200) {
                        let data = res.json();
                        this.app.setConfig('TOP_TOKEN', data.top_token);
                        this.app.setConfig('CURRENT_MEMBER', JSON.stringify(data.profile));
                        let is_page = this.route.snapshot.queryParams["is_page"];
                        let id = this.route.snapshot.queryParams["id"] ? this.route.snapshot.queryParams["id"] : null;
                        let url = is_page ? this.app.goToPageAfterLogin(is_page, id) : "";
                        var newURL = window.location.protocol + "//" + window.location.host + "/" + this.app.language + url;
                        if (isMobile.matches) {
                            window.location.href = newURL;
                        } else {
                            this.router.navigate([this.app.language + url]);
                        }
                    }
                    else {
                        this.authService.signOut();
                        this.Error_from_facebook = res.json().message_facebook;
                        this.Error_Facebook = res.json().message;
                        this.Error = {};
                    }
                });
            } else {
                this.Error_Facebook= 'アカウントの公開したメールでフェーズブラックにログインしてください。';
            }
        });


    }


}
