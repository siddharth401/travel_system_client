import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AppService} from "../../../shared/app.service";
import { AuthService } from "angular4-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";
// import allResolved = Q.allResolved;
@Component({
    selector: 'member-add',
    templateUrl: './member-add.component.html',
    styleUrls: ['./member-add.component.css']
})

export class MemberAddComponent implements OnInit {
    private Error = {};
    private Error_Facebook;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getConfig('TOP_LANG');
    private data = {'password': '', 'email': '','language_id' : this.language_id};
    private dataFb = {'authToken':''};

    constructor(private router: Router,
                private route: ActivatedRoute,
                private app: AppService,
                private authService: AuthService) {

    }

    ngOnInit() {
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


    saveData() {
        this.data.email = $('.email').val().trim();
        this.data.password = $('.password').val();
        var isMobile = window.matchMedia("only screen and (max-width: 760px)");
        this.app.post('members/register', this.data).then(res => {
            if (res.status == 200) {
                if(res.json().resend == true){
                    this.app.setConfig('RESENT_ACCOUNT',true);
                }else {
                    this.app.setConfig('RESENT_ACCOUNT',false);
                }
                var newURL = window.location.protocol + "//" + window.location.host + "/" + this.app.language + '/member/add/completion';
                if (isMobile.matches) {
                    window.location.href = newURL;
                } else {
                    this.router.navigate([this.app.language+'/member/add/completion']);
                }
            } else {
                this.Error = res.json();
                this.Error_Facebook = '';
            }
        });
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('新規会員登録　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('新規会員登録です。Facce bookのIDやメールアドレスで簡単に登録できます。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    btnClose(){
        var newURL = window.location.protocol + "//" + window.location.host + "/" + this.app.language;
        var isMobile = window.matchMedia("only screen and (max-width: 760px)");

        if (isMobile.matches) {
            window.location.href = newURL;
        } else {
            this.router.navigate([this.app.language]);
        }
    }

    addFb()
    {
        var isMobile = window.matchMedia("only screen and (max-width: 760px)");
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user=>{
                this.dataFb.authToken =  user.authToken;
                if(this.dataFb.authToken != ''){
                    this.app.get('members/facebook/add', this.dataFb).then(res => {
                        if (res.status == 200) {
                            if(res.json().resend == true){
                                this.app.setConfig('RESENT_ACCOUNT',true);
                            }else {
                                this.app.setConfig('RESENT_ACCOUNT',false);
                            }
                            var newURL = window.location.protocol + "//" + window.location.host + "/" + this.app.language + '/member/add/completion';
                            if (isMobile.matches) {
                                window.location.href = newURL;
                            } else {
                                this.router.navigate([this.app.language+'/member/add/completion']);
                            }
                        }
                        else {
                            this.authService.signOut();
                            this.Error_Facebook = res.json().message_facebook;
                            this.Error = {};
                        }
                    });
                }else {
                    this.Error_Facebook = 'アカウントの公開したメールでフェーズブラックにログインしてください。';
                }
        });
    }
}
