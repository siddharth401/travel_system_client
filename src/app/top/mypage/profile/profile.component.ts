import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
import {AuthService, FacebookLoginProvider, GoogleLoginProvider} from "angular4-social-login";

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: [
        './profile.component.css',
        '../../../../assets/top/css/mypage.css',
        '../../../../assets/top/css/remodal-default-theme.css',
        '../../../../assets/top/css/remodal.css',
    ],
})
export class ProfileComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private language = this.app.getCurrentLanguage();
    private curMember = this.app.getCurrentMember();
    private languageError = [];
    private categoryError = [];
    private countryErr = [];
    private cityErr = [];
    private listlanguage;
    private listCountry;
    private listCountryMemberPlaces;
    private listCategories;
    private member = {'fb':'','phone':'','phone_code':'','introduce_plan':'','password':'','mail_magazine_option':1,'gender':1,'guider_ranking':'','banner':'','approve_guide':'','address':'','email':'','type':1,'nick_name':'','name':'','country_id':'','introduce':'','prefecture_id':'',prefectures:[],languages:[],categories:[],member_places:[]};
    private phone;
    private selectedPrefecture;
    private selectedCountry;
    private selectedCategory;
    private selectedLanguage;
    private params = {'language_id':this.language_id,'member_id':''};
    private data = {
        'form_confirm': true,
        'is_agree_conditions': true,
        'id':'',
        'languages': [],
        'categories': [],
        'member_places': [],
        'name':'',
        'type':1,
        'nick_name':'',
        'gender':'',
        'phone':'',
        'country_id':'',
        'prefecture_id':'',
        'category_id':'',
        'address':'',
        'mail_magazine_option':'',
        'introduce':'',
        'introduce_plan':'',
        'password':'',
        'phone_code':''
    };
    private dataFb = {
        'form_confirm': true,
        'authToken' :''
    };
    private msgFb;
    private error = {};
    private Languages = {'languages': [{'language_id': ''}]};
    private Categories = {'categories': [{'category_id': ''}]};
    private Member_places = {'member_places': [{'country_id': '','city_id':''}]};
    private listCities = [];
    private listPre = {};
    private member_id;
    private number_on_header = this.app.number_on_header;
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router,
                private authService: AuthService) {
    }

    ngOnInit() {
        window.scrollTo(0,0);

        this.app.checkAuth();
        this.app.checkDisplayLanguage(this.language);
        let curMember = this.app.getCurrentMember();
        this.params.member_id = curMember ? curMember.id : 1;
        this.route.params.subscribe((params) => {
            if (params) {
                this.app.get('mypage/profile', this.params).then(res => {
                    if (res.status == 200) {
                        this.member = res.json().data;
                        if(this.member.phone){
                            // let phone_first = this.member.phone.substring(0,3);
                            // let phone_second = this.member.phone.substring(3,7);
                            // let phone_three = this.member.phone.substring(7);
                            // this.phone = phone_first + '-' + phone_second + '-' + phone_three;
                            this.phone = this.member.phone;
                        }
                        this.Member_places.member_places = res.json().data.member_places;
                        //get list cities follow country with member places of guider
                        if(res.json().data.member_places.length > 0) {
                            for (let i = 0; i < res.json().data.member_places.length; i++) {
                                this.getListCity(res.json().data.member_places[i].country_id, i);
                            }
                        }
                        this.data.type = this.member.type;
                        this.selectedCountry = parseInt(res.json().data.country_id);
                        this.selectedPrefecture = parseInt(res.json().data.prefecture_id);
                        this.selectedCategory = parseInt(res.json().data.category_id);
                        this.selectedLanguage = parseInt(res.json().data.language_id);
                        this.Member_places.member_places = res.json().data.member_places;
                        if (this.Member_places.member_places.length < 1){
                            this.addMemberPlaces();
                        }
                        this.Languages.languages = res.json().data.languages;
                        if (this.Languages.languages.length < 1){
                            this.addLanguage();
                        }
                        this.Categories.categories = res.json().data.categories;
                        if (this.Categories.categories.length < 1){
                            this.addCategory();
                        }
                    }
                });
            }
        });
        this.getListLanguage();
        this.getListCountry();
        this.getListCountryMemberPlaces();
        this.getListCategories();
        this.getListPre();
        this.setTitleAndDescription();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - プロフィール確認 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - プロフィール登録画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getListCategories() {
        this.app.get('categories/get_categories_by_language', {'language_id': this.language_id,'active':1}).then(res => {
            if (res.status === 200) {
                this.listCategories = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    getListLanguage(){
        this.app.get('languages',{'active':1, 'is_support': 1}).then(res=>{
            if(res.status == 200){
                this.listlanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }
    addLanguage() {
        this.Languages.languages.push({'language_id': ''});
    }

    removeLanguage(index = 0) {
        this.Languages.languages.splice(index, 1);
    }

    addCategory() {
        this.Categories.categories.push({'category_id': ''});
    }

    removeCategory(index = 0) {
        this.Categories.categories.splice(index, 1);
    }

    addMemberPlaces() {
        this.Member_places.member_places.push({'country_id': '','city_id':''});
    }

    removeMemberPlaces(index = 0) {
        this.Member_places.member_places.splice(index, 1);
    }
    confirmSave(){
        if($('#profile-gender-01').is(':checked') == true){
            this.data.gender = this.app.constant.Male;
        }else {
            this.data.gender = this.app.constant.Female;
        }
        if($('#user-magazine-01').is(':checked') == true){
            this.data.mail_magazine_option = this.app.constant.Send;
        }else {
            this.data.mail_magazine_option = this.app.constant.Not_Send;
        }
        this.data.name = $('#profile-name').val().trim();
        this.data.nick_name = $('#profile-nickname').val().trim();
        this.data.phone = $('#profile-tel').val();
        // this.data.phone = this.data.phone.replace(/-/g, "").trim();
        this.data.phone_code = $('#phone_code').val();
        this.data.country_id = $('.country_id').val();
        this.data.address = $('#profile-address').val().trim();
        this.data.introduce_plan = $('#profile-selfintroduction-guide').val();
        if (this.member.type == this.app.constant.MEMBER_GUIDER && $('#profile-selfintroduction').val() == undefined){
            delete this.data.introduce;
        } else {
            this.data.introduce = $('#profile-selfintroduction').val();
        }
        if ($('.prefecture_id').val() == undefined){
             this.data.prefecture_id ='';
        } else {
            this.data.prefecture_id = $('.prefecture_id').val();
        }
        if ($('.country_id').val() == ''){
            delete this.data.country_id;
        }else {
            this.data.country_id = $('.country_id').val();
        }
        if ($('#password').val() == ''){
            delete this.data.password;
        }else {
            this.data.password = $('#password').val();
        }
        if ($('#profile-selfintroduction-guide').val() == undefined){
            delete this.data.introduce_plan;
        }else {
            this.data.introduce_plan = $('#profile-selfintroduction-guide').val();
        }
        if (this.Languages.languages) {
            var languages = [];
            $.each(this.Languages.languages, function (index, value) {
                languages.push({'language_id': value.language_id});
            });
            this.data.languages = languages;
        }
        if (this.Categories.categories) {
            var categories = [];
            $.each(this.Categories.categories, function (index, value) {
                categories.push({'category_id': value.category_id});
            });
            this.data.categories = categories;
        }
        if (this.Member_places.member_places && this.data.type == this.app.constant.MEMBER_GUIDER) {
            var member_places = [];
            $.each(this.Member_places.member_places, function (index, value) {
                member_places.push({'country_id': value.country_id,'city_id': value.city_id});
            });
            this.data.member_places = member_places;
        }
        this.data.id = this.curMember ? this.curMember.id : 1;
        this.app.post('mypage/profile/update', this.data).then(res => {
            if (res.status == 200) {
                $(".modal-dialog").css("display","block");
            } else {
                window.scrollTo(0,400);
                this.error = res.json();
                this.languageError = [];
                this.categoryError = [];
                this.countryErr = [];
                this.cityErr = [];
                for (let i = 0; i < $('.country_id-member').length; i++) {
                    this.countryErr.push(res.json()['member_places.' + i + '.country_id']);
                }
                for (let i = 0; i < $('.country_id-member').length; i++) {
                    this.cityErr.push(res.json()['member_places.' + i + '.city_id']);
                }
                for (let i = 0; i < $('.language_id').length; i++) {
                    this.languageError.push(res.json()['languages.' + i + '.language_id']);
                }
                for (let i = 0; i < $('.category_id').length; i++) {
                    this.categoryError.push(res.json()['categories.' + i + '.category_id']);
                }
            }
        });
    }
    showEmail(){
        this.router.navigate([this.language + '/mypage/profile/mail_update']);
    }
    close_modal(){
        $(document).on('click', '#close_modal', function () {
            $(".modal-dialog").css("display","none");
        });
        this.error = {};
        this.languageError = [];
        this.categoryError = [];
        this.countryErr = [];
        this.cityErr = [];
    }

    signIn()
    {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(user=>{
            this.dataFb.authToken = user.authToken;
            if(this.dataFb.authToken != ''){
                this.app.post('mypage/profile/connect_facebook', this.dataFb).then(res => {
                    if (res.status == 200) {
                        this.member.fb = 'true';
                        alert(this.app.ttrans('フェイスブック接続完了。'));
                    }
                });
            }

        });
    }

    save_data(){
        this.data['form_complete'] = true;
        this.app.post('mypage/profile/update', this.data).then(res => {
            if (res.status == 200){
                this.number_on_header.current_name = res.json().profile.name;
                // if(this.language_id == this.app.constant.JA_LANGUAGE_ID){
                //     $('.user-menu__name').text('よこそう'+res.json().profile.name+'様');
                // }else {
                //     if(res.json().profile.gender == this.app.constant.Female){
                //         $('.user-menu__name').text('Welcome Ms '+res.json().profile.name);
                //     }else {
                //         $('.user-menu__name').text('Welcome Mr '+res.json().profile.name);
                //     }
                // }
                this.app.setConfig('CURRENT_MEMBER', JSON.stringify(res.json().profile));
                // this.router.navigate([this.language+ '/mypage/profile/update']);
                if(this.language_id  == this.app.constant.JA_LANGUAGE_ID){
                    window.location.replace(this.app.constant.BASE_WEB+this.app.language+"mypage/profile/update");
                }else {
                    window.location.replace(this.app.constant.BASE_WEB+this.app.language+"/mypage/profile/update");
                }
            }
        });
    }

    showGuide(){
        window.scrollTo(0,0);
        $(".modal-dialog-01").css("display","block");
    }
    showGuide02(){
        window.scrollTo(0,0);
        $(".modal-dialog-02").css("display","block");
    }
    close_modal_approve_guide(){
        $(document).on('click', '.close_modal_approve_guide', function () {
            $(".modal-dialog-01").css("display","none");
        });
    }
    close_modal_approve_guide_02(){
        $(document).on('click', '.close_modal_approve_guide_02', function () {
            $(".modal-dialog-02").css("display","none");
        });
    }
    close_modal_confirm(){
        $(document).on('click', '.close_confirm', function () {
            $(".modal-dialog").css("display","none");
        });
    }
    approveGuide(id,valueColumnChange){
        this.curMember = this.app.getCurrentMember();
        if(this.curMember.avatar == null){
            alert(this.app.ttrans('管理者は承認しました。プロフィール画像をアップロード、ガイド登録するボタンをクリックして、ガイドになってください。'))
        }else {
            if(confirm(this.app.ttrans("本当にガイドになりますか？"))) {
                this.app.post('mypage/profile/change_type', {
                    member_id: id,
                    valueColumnChange: valueColumnChange
                }).then(res => {
                    if (res.status == 200) {
                        this.member.type = parseInt(valueColumnChange);
                        window.scrollTo(0,0);
                        $(".modal-dialog-03").css("display","block");
                        setTimeout((router: Router) => {
                            this.router.navigate([this.language+'/member/logout-all']);
                        }, 5000);  //5s
                        // this.router.navigate([this.language+'/member/logout']);
                    }
                });
            }else {
                //nothing
            }
        }

    }
    DeleteFb(){
      if(confirm(this.app.ttrans("フェイスブック接続を削除しますか？"))) {
          this.app.post('mypage/profile/remove_facebook', {
              'form_confirm': true,
          }).then(res => {
              if (res.status == 200) {
                  alert(this.app.ttrans('フェイスブック接続を削除しました。'));
                  this.member.fb = '';
              }
              else {
                  alert(this.app.ttrans('プロフィールで会員のパスワードをまだ設定していないので、Facebook連携が削除できません。'));
                  this.msgFb = res.json();
              }
          });
      }
    }

    updateProfile() {
        this.router.navigate([this.language+'/mypage/profile']);
    }

    updateImage(){
        this.router.navigate([this.language+'/mypage/profile/resume']);
    }

    //get list language
    getListPre()
    {
        this.app.get('prefectures/frontend_lists',{'language_id':this.language_id}).then(res =>
        {
            if (res.status == 200) {
                this.member.country_id = $('#profile-contory').val();
                this.listPre = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }

    //get list city follow prefecture or country
    getListCity(country_id = null,i = null){
        if(country_id) {
            this.app.get('cities/list_by_country',{'country_id': country_id, 'language_id': this.language_id}).then(res => {
                if (res.status == 200) {
                    this.listCities[i] = this.app.arrToList(res.json().data, 'id', 'name');
                }
            });
        }
    }

    //get list country for profile
    getListCountry(){
        this.app.get('countries/frontend_lists', {'type': this.app.constant.COUNTRY_IS_PROFILE, 'language_id': this.language_id}).then(res =>
        {
            if (res.status == 200) {
                this.listCountry = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }
    //get list country for search data
    getListCountryMemberPlaces(){
        this.app.get('countries/frontend_lists', {'type': this.app.constant.COUNTRY_IS_SEARCH, 'language_id': this.language_id}).then(res =>
        {
            if (res.status == 200) {
                this.listCountryMemberPlaces = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });

    }
    DestroyGuide(){
        this.member_id = this.curMember ? this.curMember.id : 1;
        if(confirm(this.app.ttrans("本当に退会しますか？"))) {
            this.app.post('members/destroy', {'member_id': this.member_id}).then(res => {
                if (res.status == 200) {
                    $(".modal-dialog-04").css("display", "block");
                    setTimeout((router: Router) => {
                        this.router.navigate([this.language+'/member/logout-all']);
                    }, 5000);  //5s
                } else {
                    alert(this.app.ttrans(res.json().message));
                }
            });
        }
    }
}

