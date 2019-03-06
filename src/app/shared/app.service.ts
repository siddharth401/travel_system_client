import {Injectable, Inject, EventEmitter, Output, Input, PLATFORM_ID} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {TranslationPipe} from "./translation/translation.pipe";
import {TopTranslationPipe} from "./top-translation/top-translation.pipe";
import {constant} from "./constant";
import {storage} from './localStorageAsCookie';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {AddFixedIdPipe} from "./addFixedId";
import {DatexPipe} from "./datex.pipe";
import {Title, Meta}     from '@angular/platform-browser';
import {assign} from "rxjs/util/assign";
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AppService {
    public curUser: any;
    public curLang: string;
    public curTopLang: string;
    public curParam: any;
    public uploadImagePlans: any = [];
    public image_edit_plans: any = [];

    public constant = constant;
    private searchParams = constant.SearchParams;
    public filesUpload: any = [];
    private is_loading_pc = false;
    @Input() event: EventEmitter<any> = new EventEmitter();
    public curMember;
    public language = this.getCurrentLanguage();
    public language_prefix = this.getCurrentPrefixLanguage();
    public top_lang_id = this.getCurrentLanguageId();
    public language_url = this.getCurrentLanguage();
    public listDataFormSearch = {
        cities: [],
        categories: [],
        languages: []
    };
    public is_disabled_language = false;
    public content_page;

    private urlSetting = [
        'city_prefix',
        'category_prefix',
        'language_prefix',
        'date_plan',
        'sort'
    ];
    public backend_language_id = this.getConfig('BACKEND_LANG_ID') ? this.getConfig('BACKEND_LANG_ID') : this.constant.JA_LANGUAGE_ID;
    public plan_language_id;

    public number_on_header = {
        booking_guide : {booking_confirm_execute:'',booking_exist:'',booking_request_review:'',booking_waiting:''},
        booking_member:{booking_confirm_execute:'',booking_exist:'',booking_request_review:'',booking_waiting:''},
        count_favourites: 0,
        count_unread: 0,
        count_plans: 0,
        count_requests: 0,
        count_bookings: 0,
        avatar: '',
        current_name: ''
    };

    public languages = [];

    constructor
    (public http: Http,
     private route: ActivatedRoute,
     private router: Router,
     private titleService: Title,
     private metaService: Meta,
     @Inject(PLATFORM_ID) private platformId: Object
     ) {
        this.setScrollTop();
        if(this.getConfig('CURRENT_USER','')) {
            this.curUser = JSON.parse(this.getConfig('CURRENT_USER',''));
        }
        this.curLang = this.getConfig('LANG', 'us');
        //Loading function on top page
        var curUrl = window.location.href;
        let is_admin = curUrl.indexOf("admin");
        let is_login = curUrl.indexOf("login");
        if(is_admin < 0) {
            this.setCurrentMember();
            //get list language on top
            this.getLanguages();
            //check language on url then set config local storage
            let url_path_name = window.location.pathname;
            let pathArr = window.location.pathname.split( '/' );
            let language_prefix = pathArr[1] == this.constant.DEFAULT_LANGUAGE_URL ? this.constant.DEFAULT_LANGUAGE_URL : pathArr[1];
            this.setLanguage(language_prefix);
        } else {
            this.checkSesstionBackendTimeout();
        }
        //set local storage for language top
        if(!this.getConfig('TOP_LANG')) {
            this.setConfig('TOP_LANG', this.constant.DEFAULT_LANGUAGE_URL);
        }

    }

    ngOnInit() {

    }

    setLanguage(language = this.constant.DEFAULT_LANGUAGE_URL) {
        //check language is exist on list language prefix
        let language_prefix = ['', 'ja', 'en', 'china'];
        language = language_prefix.includes(language) && language_prefix != this.constant.DEFAULT_LANGUAGE_PREFIX  ? language : this.constant.DEFAULT_LANGUAGE_URL;
        this.language = language;
        this.setConfig('TOP_LANG', language);
        //get id of language with prefix from list language
        let prefix_language = language != this.constant.DEFAULT_LANGUAGE_URL ? language : this.constant.DEFAULT_LANGUAGE_PREFIX;
        this.get('languages/get_by_display_name', {prefix: prefix_language, language_id: this.top_lang_id}).then(res =>
        {
            if (res && res.status == 200) {
                let language_id = res.json().data.id;
                this.setConfig('TOP_LANG_ID', language_id);
                this.top_lang_id = language_id;
                this.getDataFormSearch();
            } else {
                //get last current top language
                alert(this.ttrans("Currently, there is no data at  language that you chose."));
                this.router.navigate(['/']);
            }
        });
    }

    setScrollTop() {
        if (isPlatformBrowser(this.platformId)) {
            this.router.events.subscribe((event: NavigationEnd) => {
                window.scroll(0, 0);
            });
        }
    }

    checkSesstionTimeout() {
        this.get('members/check_login_expire').then(res =>
        {
            if (res.status == 200 && res.json().data == false) {
                alert(this.ttrans("ログアウトしました。再度ログインをお願いします。"));
                this.deleteFrontendStorage();
                window.location.href = this.constant.BASE_WEB;
            }
        });
    }

    checkSesstionBackendTimeout() {
        if(this.getConfig('CURRENT_USER')) {
            this.get('members/check_login_expire').then(res =>
            {
                if (res.status == 200 && res.json().data == false) {
                    alert(this.ttrans("ログアウトしました。再度ログインをお願いします。"));
                    this.deleteBackendStorage();
                    window.location.href = constant.BASE_WEB + "admin/auth/login";
                }
            });
        }
    }

    /* ---------- API { ---------- */
    get(url, data?) {
        $('.loadingRequest').show();
        var curUrl = window.location.href;
        let is_admin = curUrl.indexOf("admin");
        if (typeof(data) == "undefined") {
            data = {};
        }
        if (is_admin > 0) {
            data['token'] = this.getConfig('AUTH_TOKEN', '');

        } else {
            data['top_token'] = this.getConfig('TOP_TOKEN', '');
            let top_lang_id = this.getConfig('TOP_LANG_ID') ? parseInt(this.getConfig('TOP_LANG_ID')) : 1;
            data['language_id'] = data['language_id'] ? data['language_id'] : top_lang_id;
        }
        let params = this.convertQueryString(data);
        url += '?' + params;
        return this.http.get(this.constant.BASE_API + url).toPromise().then(this.handleSuccess).catch(this.handleError);
    }

    post(url, data, listFileFields: any = []) {
        $('.loadingRequest').show();
        var curUrl = window.location.href;
        let is_admin = curUrl.indexOf("admin");
        $('small.help-block').remove();
        $('.has-error').removeClass('has-error');
        let headers = new Headers();
        headers.append('Accept', 'application/json');

        let formData: FormData = new FormData();
        if (is_admin > 0) {
            formData.append('token', this.getConfig('AUTH_TOKEN', ''));
        } else {
            formData.append('top_token', this.getConfig('TOP_TOKEN'));
            let top_lang_id = this.getConfig('TOP_LANG_ID') ? parseInt(this.getConfig('TOP_LANG_ID')) : 1;
            formData.append('language_id', top_lang_id);
        }


        //confirm = false
        if ((!data['form_confirm'] || data['form_confirm'] == 'false') && listFileFields) {
            for (var field of listFileFields) {
                if (typeof this.filesUpload[field] != 'undefined') {
                    for (let i = 0; i < this.filesUpload[field].length; i++) {
                        var file = this.filesUpload[field][i];
                        formData.append(field + "[]", file, file.name);
                    }
                }
                if (typeof this.filesUpload[field] == 'undefined' || !this.filesUpload[field] || (this.filesUpload[field] && !this.filesUpload[field].length)) {
                    formData.append(field, '');
                }
                this.filesUpload[field] = false;
            }
        }
        //confirm = true
        if (data['form_confirm']) {
            for (var field of listFileFields) {
                if (typeof this.filesUpload[field] == 'undefined' || !this.filesUpload[field] || (this.filesUpload[field] && !this.filesUpload[field].length)) {

                    if (typeof data['id'] != 'undefined' && data['id']) {
                        formData.append(field, 'confirm_file');
                    } else {
                        formData.append(field, '');
                    }
                } else {
                    formData.append(field, 'confirm_file');
                }
            }
        }

        for (var key in data) {
            /* Data transform { */
            if (data[key] === true) data[key] = 1;
            if (data[key] === false) data[key] = 0;
            if (data[key] === null) data[key] = '';

            // Convert array to json obj
            if (Object.prototype.toString.call(data[key]) === '[object Array]' && data[key].length > 0) {
                data[key] = JSON.stringify(data[key]);
            }
            /* Data transform } */
            formData.append(key, data[key]);
        }
        let currentService = this;
        return this.http.post(this.constant.BASE_API + url, formData, {headers: headers}).toPromise().then(function (res) {
            if (typeof currentService.filesUpload[field] != 'undefined') {
                currentService.filesUpload[field] = false;
            }
            return currentService.handleSuccess(res);
        }).catch(this.handleError);
    }

    handleSuccess(res: any) {
        $('.loadingRequest').hide();
        return res;
    }

    handleError(res: any) {
        // check page is admin or not
        var is_admin = window.location.href.indexOf("admin");
        if (res.status == 500 && is_admin < 0) {
            //this.delConfig("CURRENT_MEMBER");
            alert('システムエラーです');
        } else if (res.status == 422 && is_admin > -1) {
            // Remove error
            let messageAlert = res.json().message;
            if (!messageAlert) {
                messageAlert = new TranslationPipe().transform('Please check your input data!');
            }

            if (!$('.alertCustom').length) {
                $('#content').not('.page-login').prepend('<div class="alert alert-block alertCustom alert-danger"><button class="close" data-dismiss="alert">×</button>' + messageAlert + '</div>')
            }
            else {
                $('.alertCustom').removeClass('alert-success').addClass('alert-danger');
                $('.alertCustom').html(messageAlert);
            }
            $('.has-error').removeClass('has-error');
            $('small.help-block').remove();
            $('#error-message').remove();

            // Add error
            $.each(res.json(), function (key, obj) {
                let eleInput = $('[formControlName="' + key + '"]');
                if (key == 'error-message') {
                    $('[role="content"]').prepend('<div id="error-message" class="alert alert-block alert-danger"><p>' + new TranslationPipe().transform(obj) + '</p></div>');
                }
                else if (eleInput) {
                    eleInput.closest('div').addClass('has-error');

                    if (eleInput.parent('.input-group').length == 1) {
                        eleInput.parent().after('<small class="help-block">' + new TranslationPipe().transform(obj[0]) + '</small>');
                    }
                    else {
                        eleInput.after('<small class="help-block">' + new TranslationPipe().transform(obj[0]) + '</small>');
                    }
                }
            });
        }
        $('.loadingRequest').hide();
        return res;
    }

    /* ---------- API } ---------- */

    /* ---------- Flash { ---------- */
    adminFlashSuccess(message, onPage: boolean = false) {
        if (onPage) {
            // Remove all error
            $('.has-error').removeClass('has-error');
            $('small.help-block').remove();
            $('#error-message').remove();
            $('admin-flash').html('');

            if (!$('.alertCustom').length) {
                $('#content').prepend('<div class="alert alert-block alertCustom alert-success"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i>' + message + '</div>')
            }
            else {
                $('.alertCustom').removeClass('alert-danger').addClass('alert-success');
                $('.alertCustom').html(message);
            }
        }
        else {
            this.setConfig('ADMIN-FLASH', JSON.stringify(
                {
                    type: 'alert-success',
                    message: message
                }));
        }
    }

    adminFlashError(message, onPage: boolean = false) {
        if (onPage) {
            $('admin-flash').html('');
            if (!$('.alertCustom').length) {
                $('#content').prepend('<div class="alert alert-block alertCustom alert-danger"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i>' + message + '</div>')
            }
            else {
                $('.alertCustom').removeClass('alert-success').addClass('alert-danger');
                $('.alertCustom').html(message);
            }
        }
        else {
            this.setConfig('ADMIN-FLASH', JSON.stringify
            ({
                type: 'alert-danger',
                message: message
            }));
        }
    }

    /* ---------- Flash } ---------- */

    /* ---------- Config { ---------- */
    getConfig(key, defaultValue?) {
        if (storage.isSupported()) {
            if (localStorage.getItem(key) !== null) {
                return localStorage.getItem(key);
            }
            else {
                return defaultValue;
            }
        } else {
            return storage.getItem(key, defaultValue);
        }
    }

    setConfig(key, value) {
        if (storage.isSupported()) {
            localStorage.setItem(key, value);
        }
        else {
            storage.setItem(key, value);
        }
    }

    delConfig(key) {
        if (storage.isSupported()) {
            localStorage.removeItem(key);
        }
        else {
            storage.removeItem(key);
        }
    }

    deleteFrontendStorage() {
        let array = ["CURRENT_MEMBER", "GUIDER_PLAN_DATE", "TOP_TOKEN", "bookingId", "confirmBooking",
            "APPLY_BOOKING_NAME", "confirmCreatePlan", "Plan_Language", "confirmEditPlan", "language_id_plan", "title_plan", "editconfirmProposalPlan", "confirmMyPageRequest", "REQUEST_TITLE",
            "confirmCancelBooking", "title_plan", "title_request", "booking_request_id", "booking_plan_id", "detailSuggestPlan", "bookingId", "confirmPlan", "detailTourFavoriteNoLogin", "GUIDER_PLAN_DATE",
            "detailTourNoLogin", "goToBookingF04NoLogin","confirmReservation", "PREVIOUS_LOGIN_URL"];
        for (var index in array) {
            this.delConfig(array[index]);
        }
    }

    deleteBackendStorage() {
        let array = ["CURRENT_USER", "BACKEND_LANG_ID"];
        for (var index in array) {
            this.delConfig(array[index]);
        }
    }

    /* ---------- Config } ---------- */


    arrToList(data, key, value) {
        var result = {};
        for (var index in data) {
            result[data[index][key]] = data[index][value];
        }
        return result;
    }

    pushToArr(data, key, value) {
        var result = [];
        for (var index in data) {
            if (data[index][value] && data[index][value] != "") {
                result.push(data[index][value]);
            }
        }
        return result;
    }

    convertQueryString(data) {
        var str = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
        }
        return str.join("&");
    }

    trans(str) {
        return new TranslationPipe().transform(str);
    }

    ttrans(str) {
        return new TopTranslationPipe().transform(str);
    }

    addFixedId(id, str) {
        return new AddFixedIdPipe().transform(id, str);
    }

    datex(value, str) {
        return new DatexPipe().transform(value, str);
    }

    //suggesstion result on text box advance search
    suggesstionText(data, type = 1) {
        var field_name = type == 1 ? 'member_name' : 'email';
        var listDataSuggestions = data ? this.pushToArr(data, 'id', field_name) : [];
        $(document).ready(function () {
            if (type == 1) {
                $('[name="member_name"]').autocomplete({
                    source: listDataSuggestions
                });
            } else {
                $('[name="email"]').autocomplete({
                    source: listDataSuggestions
                });
            }
        });
    }

    memberLogout() {
        let top_token = this.getConfig('TOP_TOKEN');
        this.delConfig('CURRENT_MEMBER');
        this.get('members/logout', {top_token: top_token}).then(res =>
        {
            if (res.status == 200) {
                this.deleteFrontendStorage();
                window.location.href = this.constant.BASE_WEB;
            } else {
                window.location.href = this.constant.BASE_WEB;
            }
        });
    }

    //set title for page
    setTitle(newTitle: string) {
        $("meta[property='og:title']").remove();
        this.metaService.addTag({property: "og:title", content: newTitle});
        this.titleService.setTitle(newTitle);
    }

    setMetaIndex(content: string) {
        $('head').append('<meta content="' + content + '">');
    }

    setMetaRobots(content: string) {
        this.metaService.addTag({name: 'robots', content: content});
    }

    removeMetaTag() {
        $("meta[name='robots']").remove();
        $("meta[content='noindex,follow']").remove();
    }

    setMeta(params = []) {
        for (let key in params) {
            if (params[key].name == 'description') {
                $("meta[property='og:description']").remove();
                this.metaService.addTag({property: "og:description", content: params[key].content});
            }
            this.metaService.addTag({name: params[key].name, content: params[key].content});
        }
    }

    removeCanonical() {
        $("link[rel='canonical']").remove();
    }

    removeAlternate() {
        $("link[rel='alternate']").remove();
    }

    setAlternate() {
        let path_url = window.location.pathname;
        path_url = this.top_lang_id != this.constant.JA_LANGUAGE_ID ? path_url.replace('/'+this.constant.EN_LANGUAGE_URL, '') : path_url;
        $('head').append('<link rel="alternate" href="' + this.constant.STANDARD_URL + '/' + this.constant.EN_LANGUAGE_URL + path_url + '" hreflang="x-default">');
        $('head').append('<link rel="alternate" href="' + this.constant.STANDARD_URL + path_url + '" hreflang="ja">');
        $('head').append('<link rel="alternate" href="' + this.constant.STANDARD_URL + '/' + this.constant.EN_LANGUAGE_URL + path_url + '" hreflang="en">');
    }

    setCanonical() {
        //get current url for set canonical
        let url_path_name = window.location.pathname;
        //check exist sort on url, remove last sort params on url
        url_path_name = url_path_name.indexOf("sort-") > 0 ? url_path_name.slice(0, url_path_name.lastIndexOf('/')) : url_path_name;
        //remove params language which is different japan
        url_path_name = this.top_lang_id != this.constant.JA_LANGUAGE_ID ? url_path_name.replace('/'+this.constant.EN_LANGUAGE_URL, '') : url_path_name;
        $('head').append('<link rel="canonical" href="' + this.constant.STANDARD_URL + url_path_name + '">');
    }

    genarateUrlSearchTour(params: Object = {}, arrUrl = null) {
        var url = arrUrl ? arrUrl : '';
        let urlSetting = this.urlSetting;
        for (let key in params) {
            switch (key) {
                case 'city_prefix':
                    if (key == 'city_prefix' && params[key] != '') {
                        url += '/city-' + params[key];
                    }
                    break;
                case 'category_prefix':
                    if(key == 'category_prefix' && params[key].length > 0)
                    {
                        var tmp = '';
                        for (let category of params[key])
                        {
                            tmp = tmp + category + '-';
                        }
                        if(tmp)
                        {
                            tmp = tmp.substring(0, tmp.length - 1);
                            url += '/category-'+ tmp;
                        }
                    }
                    break;
                case 'language_prefix':
                    if (key == 'language_prefix' && params[key] != '') {
                        url += '/language-' + params[key];
                    }
                    break;
                case 'date_plan':
                    if (key == 'date_plan' && params[key] != '') {
                        let date = params[key].split('/').join('');
                        url += '/' + date;
                    }
                    break;
                case 'sort':
                    if (key == 'sort' && params[key] != '') {
                        url += '/sort-' + params[key];
                    }
                    break;
                default:
                    break;
            }
        }
        return url;
    }

    exportUrl(params: Object) {
        let result = {
            city_prefix: '',
            category_prefix: [],
            language_prefix: '',
            date_plan: '',
            sort: ''
        };
        if (params) {
            for (let key in params) {
                var i = params[key].indexOf('-');
                if (i > 0) {
                    var prefix = params[key].slice(0, i);
                    var value = params[key].slice(i + 1);
                    switch (prefix) {
                        case 'city':
                            if (value != '') {
                                result.city_prefix = value;
                            }
                            break;
                        case 'category':
                            if (value != '') {
                                var cateID = value.split("-");
                                result.category_prefix = cateID;
                            }
                            break;
                        case 'language':
                            if (value != '') {
                                result.language_prefix = value;
                            }
                            break;
                        case 'sort':
                            if (value != '') {
                                result.sort = value;
                            }
                            break;
                    }
                } else {
                    result.date_plan = (key != 'language' && params[key]) ? params[key] : "";
                }
            }
        }
        return result;
    }

    exportStringBreadCrumb(params:Object) {
        var curUrl = window.location.href;
        let is_request_search = curUrl.indexOf("request/search");
        var last_str = "";
        if(is_request_search > 0) {
            last_str = "の旅のリクエスト一覧";
        } else {
            last_str = "の旅プラン一覧";
        }
        let result = [];
        let last = '';
        let lastDefault = '';
        let lastTemp = '';
        let check = true;
        let option = [];
        if (params) {
            for (let key in params) {
                switch (key) {
                    case 'city':
                        if(params[key].length > 0)
                        {
                            // result.push([params[key][0]+'発', 'city-'+params[key][0]]);
                            result.push([params[key][0], 'city-'+params[key][1]]);
                            lastDefault = params[key][0]+this.ttrans(last_str);
                        }
                        break;
                    case 'category':
                        if(params[key].length > 0) {
                            var tmp = '';
                            var tmpName = '';
                            for (let item of params[key]) {
                                tmp += item[1] + '-';
                                tmpName += item[0] + '・';
                            }
                            tmp = tmp.slice(0, -1);
                            tmp = 'category-' + tmp;
                            tmpName = tmpName.slice(0, -1);
                            var arr = [];
                            arr[0] = tmpName;
                            arr[1] = tmp;
                            result.push(arr);
                            lastDefault = tmpName+this.ttrans(last_str);
                        }
                        break;
                    case 'language':
                        if(params[key].length > 0) {
                            let language_trans = this.ttrans(params[key][0]);
                            var arr = [language_trans, 'language-' + params[key][1]];
                            result.push(arr);
                            lastDefault = language_trans+this.ttrans(last_str);
                        }
                        break;

                    case 'date_plan':
                        if(params[key].length > 0)
                        {
                            var tmpDate = params[key][0].split('/');
                            last = tmpDate[0] + this.ttrans('F03_年') + tmpDate[1] + this.ttrans('F03_月') + tmpDate[2] + this.ttrans(last_str);
                            check = false;
                        }
                        break;
                }
            }
        }
        if(check && result.length > 0)
        {
            result.splice(result.length - 1, 1);
            check = false;
        }
        else if (lastTemp)
        {
            last = lastTemp + this.ttrans(last_str);
        }
        if(!last && lastDefault)
        {
            last = lastDefault;
            if(check)
            {
                result.splice(result.length - 1, 1);
            }
        }
        option.push(result);
        option.push(last);
        return option;
    }

    exportStringTitleDescription(params:Object, is_title = true) {
        var last_str = "";
        //Check export string title or description
        last_str = is_title == true ? "旅プランから探す　l　マッチングガイド - MATCHING GUIDE" : "旅プラン一覧。行きたい場所やしたいことなどから、興味のあるプランを見つけてください。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。";
        //check params then export related string
        let lastDefault = '';
        if (params) {
            for (let key in params) {
                switch (key) {
                    case 'language':
                        if(params[key].length > 0)
                        {
                            lastDefault += this.ttrans(params[key][0])+'で';
                        }
                        break;
                    case 'date_plan':
                        if(params[key].length > 0)
                        {
                            lastDefault += params[key][0]+ '実施できる';
                        }
                        break;
                    case 'city':
                        if(params[key].length > 0)
                        {
                            lastDefault += params[key][0]+ 'の';
                        }
                        break;
                    case 'category':
                        if(params[key].length > 0) {
                            var tmpName = '';
                            for (let item of params[key]) {
                                tmpName += item[0] + '・';
                            }
                            tmpName = tmpName.slice(0, -1);
                            lastDefault += tmpName + 'の';
                        }
                        break;
                }
            }
        }

        lastDefault = lastDefault + last_str ;
        lastDefault = lastDefault.replace('のの', 'の');
        return lastDefault;
    }

    exportStringEnglishTitleDescription(params:Object, is_title = true) {
        var last_str = "";
        //Check export string title or description
        last_str = is_title == true ? " | MATCHING GUIDE" : " .Please find interesting plans from where you want to go and what you want to do. Matching guide is a site where people who want to original travel, not regular vacations, meet people who want to guide such travelers.";
        //check params then export related string
        let lastDefault = is_title == true ? 'Search plans ' : 'A list of Japanese trip plans that can be implemented ';
        if (params) {
            for (let key in params) {
                switch (key) {
                    case 'language':
                        if(params[key].length > 0)
                        {
                            lastDefault += ' in ' + this.ttrans(params[key][0]);
                        }
                        break;
                    case 'date_plan':
                        if(params[key].length > 0)
                        {
                            lastDefault += ' on ' + params[key][0];
                        }
                        break;
                    case 'city':
                        if(params[key].length > 0)
                        {
                            lastDefault += ' in ' + params[key][0];
                        }
                        break;
                    case 'category':
                        if(params[key].length > 0) {
                            var tmpName = '';
                            for (let item of params[key]) {
                                tmpName += item[0] + '・';
                            }
                            tmpName = tmpName.slice(0, -1);
                            lastDefault += ' in ' + tmpName;
                        }
                        break;
                }
            }
        }

        lastDefault = lastDefault + last_str;
        lastDefault = lastDefault.replace('  ', ' ');


        return lastDefault;
    }

    getCurrentLanguage() {
        let language = this.getConfig('TOP_LANG') && this.getConfig('TOP_LANG') != this.constant.DEFAULT_LANGUAGE_PREFIX ? this.getConfig('TOP_LANG') : "";
        return language;
    }

    getCurrentPrefixLanguage() {
        let language = this.getConfig('TOP_LANG') && this.getConfig('TOP_LANG') != this.constant.DEFAULT_LANGUAGE_URL ? this.getConfig('TOP_LANG') : this.constant.DEFAULT_LANGUAGE_PREFIX;
        return language;
    }

    getCurrentLanguageId() {
        let top_language_id = this.getConfig('TOP_LANG_ID') ? this.getConfig('TOP_LANG_ID') : this.constant.TOP_LANGUAGE_ID;
        return top_language_id;
    }

    getCurrentMember() {
        var curMember = this.getConfig('CURRENT_MEMBER') ? JSON.parse(this.getConfig('CURRENT_MEMBER')) : null;
        return curMember;
    }

    getCurrentMemberAvatar() {
        var curMember = this.getConfig('CURRENT_MEMBER') ? JSON.parse(this.getConfig('CURRENT_MEMBER')) : null;
        let avatar = curMember ? curMember.avatar : null;
        return avatar;
    }

    setCurrentMember(){
        var curMember = this.getConfig('CURRENT_MEMBER') ? JSON.parse(this.getConfig('CURRENT_MEMBER')) : null;
        this.curMember = curMember;
    }
        
    checkDisplayLanguage(lang) {
        this.setScrollTop();
        //check route is member page
        let url_path_name = window.location.pathname;
        if(url_path_name.indexOf("member") > 0) {
            $("top-header").css({ 'display': "none" });
            $("top-footer").css({ 'display': "none" });
            $("#sb-site-container").removeAttr('style');
        } else {
            $("top-header").css({ 'display': "block" });
            $("top-footer").css({ 'display': "block" });
        }
        //set alternate
        this.removeAlternate();
        this.setAlternate();
        //set canonical
        this.removeCanonical();
        this.setCanonical();
        var curUrl = window.location.href;
        let is_my_page = curUrl.indexOf("mypage");
        let is_reservation = curUrl.indexOf("reservation");
        let is_add = curUrl.indexOf("add");
        let is_create = curUrl.indexOf("create");
        let is_profile = curUrl.indexOf("profile");
        this.curMember = this.getConfig('CURRENT_MEMBER') ? JSON.parse(this.getConfig('CURRENT_MEMBER')) : null;
        let curMember = this.curMember;
        //get list my page top
        if(curMember) {
            this.getListTopMyPage(curMember.id);
        }
        //check disabled select switch language with page input data
        let is_reservationtour = curUrl.indexOf("reservationtour");
        let is_apply = curUrl.indexOf("apply");
        let is_plan = curUrl.indexOf("plan");
        let is_request = curUrl.indexOf("request");
        let is_suggestion = curUrl.indexOf("suggestion");
        let is_detail = curUrl.indexOf("detail");
        let is_date_select = curUrl.indexOf("dateselect");
        let is_date_register = curUrl.indexOf("dateregister");
        let is_confirmation = curUrl.indexOf("confirmation");
        let is_detail_plan = curUrl.indexOf("detail");
        let is_edit_plan = curUrl.indexOf("edit");
        let is_review_plan = curUrl.indexOf("review");
        let page_payment_error = curUrl.indexOf("page/payment/error");
        if((is_my_page < 0 && is_reservation > 0) || is_add > 0 || is_create > 0
            || (is_my_page > 0 && is_reservationtour > 0 && is_detail > 0)
            || (is_my_page > 0 && is_apply > 0 && is_detail > 0)
            || (is_request > 0 && is_detail > 0)
            || (is_my_page > 0 && is_suggestion > 0)
            || (is_my_page > 0 && is_plan > 0 && is_date_select > 0)
            || (is_my_page > 0 && is_plan > 0 && is_date_register > 0)
            || (is_my_page > 0 && is_plan > 0 && is_confirmation > 0)
            || (is_my_page > 0 && is_plan > 0 && is_detail_plan > 0)
            || (is_my_page > 0 && is_plan > 0 && is_edit_plan > 0)
            || (is_my_page > 0 && is_plan > 0 && is_review_plan > 0)
            || (is_my_page > 0 && is_profile > 0)) {
           this.is_disabled_language = true;
        } else {
            this.is_disabled_language = false;
        }
        //Check page is not booking delete local storage guider plan date, confirm booking data
        if(is_reservation < 0 && page_payment_error < 0) {
            this.delConfig('GUIDER_PLAN_DATE');
        }
        //Check delete confirm cancel booking on local storate
        let is_cancel_confirmation = curUrl.indexOf("cancel_confirmation");
        let is_cancel_completation = curUrl.indexOf("cancel_completation");
        if(is_cancel_confirmation < 0 && is_cancel_completation < 0 && page_payment_error < 0) {
            this.delConfig('confirmCancelBooking');
        }
        //check language different japan and english, redirect to not found page
        if(["", "ja", "en"].indexOf(lang) < 0) {
            this.router.navigate(['page/not-found']);
        }
        this.LoadChangeCssAndDatePicker();
    }

    LoadChangeCssAndDatePicker() {
        System.import('script-loader!assets/top/js/jquery.min.js').then(()=> {
            System.import('script-loader!assets/top/js/legacy.js');
            System.import('script-loader!assets/top/js/select2.min.js').then(()=>{
                $(document).ready(function () {
                    if($('.easy-select').length){
                        $('.easy-select').select2();
                    }
                });
            });
            System.import('script-loader!assets/top/js/slidebars.min.js').then(() => {
                System.import('script-loader!assets/top/js/slidebars.js')
            });
            var header = $('header.header');
            var topBtn = $('#pageTop a');

            var tabs = $('ul.tab__list');
            var tab = tabs.find('a');
            var search_trigger = $('.header__search-trigger');
            var user_menu = $('div.user-menu');
            var curUrl = window.location.href;
            let is_mypage = curUrl.indexOf("mypage");
            let not_found = curUrl.indexOf("not-found");

            topBtn.hide();
            $(document).ready(function () {
                var ww = $(window).width();
                var ch = $('.mypage__content').height();
                var nh = $('.mypage__menu').height();
                if(is_mypage > 0) {
                    $(".header").css("background", "rgba(0, 0, 0, 0.7)");
                    $('.mypage__menu-list').css({
                        'min-height': ch + 50,
                        "z-index": "30"
                    });
                }
                $(".js-acc-trigger").click(function () {
                    $(this).next().slideToggle();
                    $(this).toggleClass("js-acc-trigger--active");
                    $(this).toggleClass("is-current");
                    return false;
                });

                $('.mypage__menu-list').click(function () {
                    if($(this).css("left") == "-300px"){
                        $(this).animate({
                            'left': '0px'
                        });
                    }else{
                        $(this).animate({
                            'left': '-300px'
                        });
                    }
                    $('.mypage__menu').toggleClass('mypage__menu__acc--active');
                });
                $('.mypage__breadcrumb i').click(function () {
                    $('.mypage__breadcrumb').toggleClass('mypage__breadcrumb--active');
                    if($('.mypage__menu-list').css("left") == "-300px"){
                        $('.mypage__menu-list').animate({
                            'left': '0px'
                        });
                    }else{
                        $('.mypage__menu-list').animate({
                            'left': '-300px'
                        });
                    }
                    $('.mypage__menu').toggleClass('mypage__menu__acc--active');
                });

                search_trigger.unbind( "click" ); // remove event of button search
                search_trigger.on('click',function(){
                    $(this).toggleClass('is-active');
                    $('div.search--sp').slideToggle();
                });
                // #で始まるアンカーをクリックした場合に処理
                $('a[href^=#]').click(function() {
                    // スクロールの速度
                    var speed = 400; // ミリ秒
                    // アンカーの値取得
                    var href= $(this).attr("href");
                    // 移動先を取得
                    var target = $(href == "#" || href == "" ? 'html' : href);
                    // 移動先を数値で取得
                    var position = target.offset().top;
                    // スムーススクロール
                    $('body,html').animate({scrollTop:position}, speed, 'swing');
                    return false;
                });

                user_menu.click(function(){
                    $(this).toggleClass('is-active');
                    $(this).next('div').slideToggle();
                });
                $('.acc__trigger').on('click',function(){
                    $(this).toggleClass('is--active');
                    $(this).next('div').slideToggle();
                });
            });
        });
    }

    showCalendar(availableDates = null) {
        let top_lang_id = this.getConfig("TOP_LANG_ID");
        if(top_lang_id == this.constant.JA_LANGUAGE_ID) {
            var today = "今日";
            var clear = "クリア";
            var close = "閉じる";
            var labelMonthNext = "次月";
            var labelMonthPrev = "前月";
            var monthsFull = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            var weekdaysShort = ['日', '月', '火', '水', '木', '金', '土'];
        } else {
            var today = "Today";
            var clear = "Clear";
            var close = "Close";
            var labelMonthNext = "next";
            var labelMonthPrev = "prev";
            var monthsFull = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        }
        System.import('script-loader!assets/top/js/jquery.min.js').then(()=> {
            System.import('script-loader!assets/top/js/picker.js').then(()=> {
                System.import('script-loader!assets/top/js/picker.date.js').then(()=> {
                    $(document).ready(function () {
                        //今日の日付を取得してカレンダーに設定
                        var date = new Date();
                        var year = date.getFullYear();
                        var month = date.getMonth();
                        var day = date.getDate();

                        $("#input-date").pickadate({
                            monthsFull: monthsFull,
                            weekdaysShort: weekdaysShort,
                            today: today,
                            clear: clear,
                            close: close,
                            labelMonthNext: labelMonthNext,
                            labelMonthPrev: labelMonthPrev,
                            format: 'yyyy/mm/dd',
                            min: [year, month, day],
                            onClose: function () {
                                $(document.activeElement).blur();
                            }
                        });
                        $('#date-end').pickadate({
                            monthsFull: monthsFull,
                            weekdaysShort: weekdaysShort,
                            today: today,
                            clear: clear,
                            close: close,
                            labelMonthNext: labelMonthNext,
                            labelMonthPrev: labelMonthPrev,
                            format: 'yyyy/mm/dd',
                            min: [year, month, day],
                            onClose: function () {
                                $(document.activeElement).blur();
                            }
                        });
                        $('#sp-search-date').pickadate({
                            monthsFull: monthsFull,
                            weekdaysShort: weekdaysShort,
                            today: today,
                            clear: clear,
                            close: close,
                            labelMonthNext: labelMonthNext,
                            labelMonthPrev: labelMonthPrev,
                            format: 'yyyy/mm/dd',
                            min: [year, month, day],
                            onClose: function () {
                                $(document.activeElement).blur();
                            }
                        });
                    });
                });
            });
        });
    }
    showCalendarSearch(availableDates = null) {
        let top_lang_id = this.getConfig("TOP_LANG_ID");
        if(top_lang_id == this.constant.JA_LANGUAGE_ID) {
            var today = "今日";
            var clear = "クリア";
            var close = "閉じる";
            var labelMonthNext = "次月";
            var labelMonthPrev = "前月";
            var monthsFull = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            var weekdaysShort = ['日', '月', '火', '水', '木', '金', '土'];
        } else {
            var today = "Today";
            var clear = "Clear";
            var close = "Close";
            var labelMonthNext = "next";
            var labelMonthPrev = "prev";
            var monthsFull = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        }
        System.import('script-loader!assets/top/js/picker.js').then(()=> {
            System.import('script-loader!assets/top/js/picker.date.js').then(()=> {
                $(document).ready(function () {
                    //今日の日付を取得してカレンダーに設定
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var day = date.getDate();

                    $("#input-date").pickadate({
                        monthsFull: monthsFull,
                        weekdaysShort: weekdaysShort,
                        today: today,
                        clear: clear,
                        close: close,
                        labelMonthNext: labelMonthNext,
                        labelMonthPrev: labelMonthPrev,
                        format: 'yyyy/mm/dd',
                        // min: [year, month, day],
                        onClose: function() {
                            $(document.activeElement).blur();
                        }
                    });
                });
            });
        });
    }

    available(date) {
        var availableDates = ["20-3-2018","21-3-2018","23-3-2018"];
        let dmy = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
        if($.inArray(dmy, availableDates) !== -1) {
            return [true, "","Available"];
        } else {
            return [false,"","unAvailable"];
        }
    }

    setTimeOutRedirectAuto() {
        setTimeout((router: Router) => {
            this.router.navigate(['/']);
        }, 5000);  //5s
    }

    checkAuthGuider() {
        let curMember = this.getCurrentMember();
        if(!curMember) {
            alert(this.ttrans("この機能のご利用にはログインが必要です。"));
            this.router.navigate([this.language]);
        } else if(curMember && curMember.type == this.constant.MEMBER_USER) {
            alert(this.ttrans("このリンクはあなたがアクセスできません。"));
            this.router.navigate([this.language]);
        }
    }

    checkAuthMember() {
        let curMember = this.getCurrentMember();
        if(!curMember) {
            alert(this.ttrans("この機能のご利用にはログインが必要です。"));
            this.router.navigate([this.language]);
        } else if(curMember && curMember.type == this.constant.MEMBER_GUIDER) {
            alert(this.ttrans("このリンクはあなたがアクセスできません。"));
            this.router.navigate([this.language]);
        }
    }

    checkAuth() {
        if(!this.getCurrentMember()) {
            alert(this.ttrans("この機能のご利用にはログインが必要です。"));
            this.router.navigate([this.language]);
        }
    }

    checkOwner(current_id = null, owner_id = null) {
        if(!current_id || !owner_id || current_id != owner_id) {
            alert(this.ttrans("この機能のご利用にはログインが必要です。"));
            this.router.navigate([this.language]);
        }
    }

    getDayOfWeek(number_of_week) {
        let day_str = "";
        switch (number_of_week) {
            case 1:
                day_str = this.constant.MONDAY;
                break;
            case 2:
                day_str = this.constant.THURSDAY;
                break;
            case 3:
                day_str = this.constant.TUESDAY;
                break;
            case 4:
                day_str = this.constant.WEDNESDAY;
                break;
            case 5:
                day_str = this.constant.FRIDAY;
                break;
            case 6:
                day_str = this.constant.SATURDAY;
                break;
            case 0:
                day_str = this.constant.SUNDAY;
                break;
            default:
                break;
        }
        return day_str;
    }

    languageSystem(){
        let languageName = $('.dropdown-toggle span').text().trim();
        let language_id;
        if(languageName == 'English'){
            language_id = this.constant.EN_LANGUAGE_ID;
        }else {
            language_id = this.constant.JA_LANGUAGE_ID;
        }
        return language_id;
    }

    convertPhoneNumber(phone) {
        let phone_first = phone.substring(0,3);
        let phone_second = phone.substring(3,7);
        let phone_three = phone.substring(7);
        let phone_str = phone_first + '-' + phone_second + '-' + phone_three;
        return phone_str;
    }

    goToPageAfterLogin(is_page, id = null,member_id=null) {
        let url_go_to = "";
        let curMember = this.getCurrentMember();
        switch (parseInt(is_page)) {
            case this.constant.PLAN_ADD:
                if(curMember.type == this.constant.MEMBER_USER) {
                    alert(this.ttrans("ガイドのみ旅プランを作ることができます。ガイド登録してください。"));
                } else {
                    url_go_to = "/mypage/plan/create";
                }
                break;
            case this.constant.REQUEST_ADD:
                url_go_to = "/mypage/request/add";
                break;
            case this.constant.REQUEST_DETAIL:
                if(curMember.type == this.constant.MEMBER_USER) {
                    url_go_to = id ? "/request/detail/" + id : "";
                } else {
                    if(member_id == curMember.id){
                        url_go_to = id ? "/request/detail/" + id : "";
                    }else {
                        url_go_to = id ? "/suggestion/plan/add/" + id : "";
                    }
                }
                break;
            case this.constant.GUIDE_DETAIL:
                url_go_to = id ? "/guide/detail/" + id : "";
                break;
            case this.constant.TOUR_DETAIL:
                url_go_to = id ? "/tour/detail/" + id : "";
                break;
            case this.constant.BOOKING_PLAN:
                url_go_to = id ? "/reservation/" + id : "";
                break;

            default:
                break;
        }
        return url_go_to;
    }

    showPassword()
    {
        $(".toggle-password").toggleClass("fa-eye fa-eye-slash");
        var input = $($(".toggle-password").attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    }

    getDataFormSearch() {
        let top_lang_id = this.getConfig('TOP_LANG_ID');
        this.get('top_commons/data_search', {language_id: top_lang_id}).then(res =>
        {
            if (res.status == 200) {
                this.listDataFormSearch = res.json().data;
            }
        });
    }

    getLanguages() {
        this.get('languages/get_list').then(res =>
        {
            if (res.status == 200) {
                for (var index in res.json().data) {
                    this.languages.push({
                        "key": res.json().data[index].prefix,
                        "alt": res.json().data[index].name,
                        "title": res.json().data[index].name,
                        "id": res.json().data[index].id
                    });
                };
            }
        });
    }
    
    getListTopMyPage(member_id = this.curMember.id) {
        this.number_on_header.avatar = this.getCurrentMemberAvatar();
        this.number_on_header.current_name = this.curMember && this.curMember.name ? this.curMember.name : null;
        this.get('members/mypage', {'member_id' : member_id}).then(res => {
            if (res.status == 200) {
                this.number_on_header.booking_guide = res.json().data.booking_guide;
                this.number_on_header.booking_member = res.json().data.booking_member;
                this.number_on_header.count_favourites = res.json().data.count_favorites;
                this.number_on_header.count_unread = res.json().data.count_unreads;
                this.number_on_header.count_plans = res.json().data.count_plans;
                this.number_on_header.count_requests = res.json().data.count_requests;
                this.number_on_header.count_bookings = res.json().data.count_bookings;
                this.number_on_header.avatar = res.json().data.user.avatar;
            } else if(res.status == 440) {
                alert(this.ttrans("ログアウトしました。再度ログインをお願いします。"));
                this.memberLogout();
            } else if(res.status == 401) {
                alert(this.ttrans("このリンクはあなたがアクセスできません。"));
                this.memberLogout();
            }
        });
    }

    getContentStaticPage(page_name = '') {
        let top_lang_id = this.getConfig('TOP_LANG_ID');
        this.get('top_commons/get_content_static_page', {language_id: top_lang_id, name: page_name}).then(res => {
            if (res.status == 200) {
                this.content_page = res.json().data;
            }
        });
    }

}