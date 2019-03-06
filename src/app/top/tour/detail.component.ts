import {Component, OnInit} from '@angular/core';
import {AppService} from "../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import { FormData} from "../../shared/form-data";



@Component({
    selector: 'detail-tour',
    templateUrl: './detail.compomemt.html',
    styleUrls: [
        '../../../assets/top/css/detail-list.css',
        './detail.component.css'
    ]
})

export class DetailComponent implements OnInit {
    private detailPlans;
    private categories = [];
    private timeStart = [];
    private images = [];
    private guiders;
    private prefecture;
    private country;
    private addressMap;
    private languageSupport;
    private lineImg = this.app.constant.BASE_WEB + 'assets/top/img/line.svg';
    private language_id = this.app.top_lang_id;
    private languageName = this.app.getCurrentLanguage();
    private curMember = this.app.getCurrentMember();
    private detailPlanReviews:any;
    private detailPlanOthers = {data:[],total:'',last_page: '', current_page: ''};
    private detailPlanCalendar = [];
    private modifyData = {};
    private plan_id;
    private selectedDate = [];
    private currentDate;
    private currentDay;
    private currentMonth;
    private currentYear;
    private plan_year;
    private plan_month;
    private Email = {'email':'','content':'','title':'','language_id':this.app.getConfig('TOP_LANG_ID'),'plan_id':''};
    private countReview;
    public id: any;
    private fb;
    private data = {
        city_prefix: '',
        category_prefix:[],
        language_prefix:'',
        date_plan:''
    };
    public repoUrl;
    public year_review_0;
    public year_review_1;
    public year_review_2;
    public month_review_0;
    public month_review_1;
    public month_review_2;
    public day_review_0;
    public day_review_1;
    public day_review_2;
    public time_request_hour;
    public time_request_min;
    private number_on_header = this.app.number_on_header;


    constructor
    (private app: AppService,
     private route: ActivatedRoute,
     private router: Router) {
    }





    ngOnInit() {
        this.app.checkDisplayLanguage(this.languageName);
        this.fb = new FormData(this.app, this.data);
        this.route.params.subscribe((params) => {
            if (params['plan_id']) {
                this.app.plan_language_id = this.app.top_lang_id;
                if(this.languageName == ''){
                    this.repoUrl = this.app.constant.BASE_WEB + 'tour/detail/' + params['plan_id'];
                } else {
                    this.repoUrl = this.app.constant.BASE_WEB + this.languageName + '/tour/detail/' + params['plan_id'];
                }

                this.plan_id = params['plan_id'];
                this.app.get('guide_plan_detail', {plan_id: params['plan_id'], language_id: this.app.plan_language_id}).then(res => {
                    if (res.status == 200) {

                        if(res.json().data.hasFavorited && res.json().data.hasFavorited != 0){
                            $('.fa-heart').addClass('fa-red');
                        }else {
                            $('.fa-heart').removeClass('fa-red');
                        }
                        if(res.json().data.status == this.app.constant.GuiderStatus.APPROVAL_REQUEST){
                            alert(this.app.ttrans('旅プランが編集中です。'));
                            this.router.navigate(["/"]);
                        }
                        this.detailPlans = res.json().data;
                        this.categories = res.json().data.categories;
                        this.guiders = res.json().data.guiders;
                        this.languageSupport = res.json().data.languages;
                        this.country = res.json().data.country;
                        this.prefecture = res.json().data.city;
                        this.timeStart = res.json().data.time_start;
                        this.images = res.json().data.images;

                        if(res.json().data.city && res.json().data.address_meeting){
                            if(this.language_id == this.app.constant.JA_LANGUAGE_ID){
                                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q='+ res.json().data.city.name + res.json().data.address_meeting  +'&zoom=16&maptype=roadmap&language=ja&region=JP';
                            }else {
                                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q='+ res.json().data.city.name + res.json().data.address_meeting +'&zoom=16&maptype=roadmap&language=en&region=JP';
                            }
                        }else {
                            if(this.language_id == this.app.constant.JA_LANGUAGE_ID){
                                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q='+res.json().data.address_meeting +'&zoom=16&maptype=roadmap&language=ja&region=JP';
                            }else {
                                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q='+res.json().data.address_meeting +'&zoom=16&maptype=roadmap&language=en&region=JP';
                            }
                        }

                        this.app.get('guide_plan_detail_reviews',{plan_id: params['plan_id'], language_id: this.app.plan_language_id}).then(res => {
                            if(res.status == 200){
                                this.detailPlanReviews = res.json().data.reviews.data;
                                this.countReview = res.json().data.reviews.total;
                                if(res.json().data.reviews.total > 0 && res.json().data.reviews.data[0]){
                                    this.year_review_0 = res.json().data.reviews.data[0].created_at.slice(0,4);
                                    this.month_review_0 = res.json().data.reviews.data[0].created_at.slice(5,7);
                                    this.day_review_0 = res.json().data.reviews.data[0].created_at.slice(8,10);
                                }
                                if(res.json().data.reviews.total > 1 && res.json().data.reviews.data[1]){
                                    this.year_review_1 = res.json().data.reviews.data[1].created_at.slice(0,4);
                                    this.month_review_1 = res.json().data.reviews.data[1].created_at.slice(5,7);
                                    this.day_review_1 = res.json().data.reviews.data[1].created_at.slice(8,10);
                                }
                                if(res.json().data.reviews.total > 2 &&res.json().data.reviews.data[2]){
                                    this.year_review_2 = res.json().data.reviews.data[2].created_at.slice(0,4);
                                    this.month_review_2 = res.json().data.reviews.data[2].created_at.slice(5,7);
                                    this.day_review_2 = res.json().data.reviews.data[2].created_at.slice(8,10);
                                }
                            }
                        });
                        this.app.get('guide_plan_detail_other_plans',{plan_id: params['plan_id'], language_id: this.app.plan_language_id}).then(res => {
                            if(res.status == 200){
                                this.detailPlanOthers = res.json().data;
                            }
                        });
                        var d = new Date();
                        this.currentDay = d.getDay();
                        this.currentDate = d.getDate();
                        this.currentMonth = d.getMonth() + 1;
                        this.currentYear = d.getFullYear();
                        this.app.get('guide_plan_detail_calendar',{month:this.currentMonth,year:this.currentYear,plan_id: params['plan_id'], language_id: this.app.plan_language_id}).then(res => {
                            if(res.status == 200){
                                this.detailPlanCalendar = res.json().data.plan_calendar;
                                this.plan_year = res.json().data.plan_year;
                                this.plan_month = res.json().data.plan_month;
                                this.selectedDate = res.json().data.plan_selected;
                                if(this.detailPlanCalendar.length > 0) {
                                    var modifyData = {list: []};
                                    modifyData.list = this.separateDataOnWeek(this.detailPlanCalendar);
                                    this.modifyData = modifyData;
                                }
                                System.import('script-loader!assets/top/js/slick.min.js').then(() => {
                                    var slider = ".slide-list";
                                    var thumbnailItem = "#thumb-list li";
                                    var thumbnailItemNum = $(thumbnailItem).length;

                                    if(thumbnailItemNum <= 3){
                                        // サムネイル画像アイテムに data-index でindex番号を付与

                                        $(thumbnailItem).eq(0).addClass("slick-current");
                                        $(thumbnailItem).each(function(){
                                            var index = $(thumbnailItem).index(this);
                                            $(this).attr("data-index",index);
                                        });

                                        $(slider).on('init',function(slick){
                                            var index = $(".slick-slide.slick-current.slick-active").attr("data-slick-index");
                                            $(thumbnailItem+'[data-index="'+index+'"]').addClass("slick-current");
                                        });
                                        //create slider with slick
                                        this.createSlick();

                                        $(thumbnailItem).on('click',function(){
                                            var index = $(this).attr("data-index");
                                            $(slider).slick("slickGoTo",index,false);
                                        });
                                        $(slider).on('beforeChange',function(event,slick, currentSlide,nextSlide){
                                            $(thumbnailItem).each(function(){
                                                $(this).removeClass("slick-current");
                                            });
                                            $(thumbnailItem+'[data-index="'+nextSlide+'"]').addClass("slick-current");
                                        });


                                    } else {
                                        this.destroySlickSlider();
                                        this.createSlickSliderController();
                                    }
                                    $('.slick-arrow').remove();
                                });
                            }

                        });
                        this.setTitleAndDescription();
                    }else if(res.status == 404) {
                        alert(this.app.ttrans('旅プランが存在していないまたは旅プランが承認されていません。'));
                        this.app.setLanguage(this.app.constant.DEFAULT_LANGUAGE_URL);
                        this.router.navigate(["/"]);
                    }else if(res.status == 400){
                        alert(this.app.ttrans('現在、この旅プランが販売停止しています。'));
                        this.app.setLanguage(this.app.constant.DEFAULT_LANGUAGE_URL);
                        this.router.navigate(["/"]);
                    }
                });
            }
        });
    }

    createSlick(){
        if ($('.slide-list').hasClass('slick-initialized')) {
            $('.slide-list').slick('destroy');
        }
        $(".slide-list").slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            autoplay:true,
            infinite: true,
            responsive: [{
                breakpoint: 600,
                settings: {
                    dots: true
                }
            }]
        });

    }

    createSlickSliderController() {
        $('.slide-list').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: true,
            autoplay:true,
            autoplaySpeed:10000,
            asNavFor: '.thumb-list',
            appendArrows : '.slide-controller',
            responsive: [{
                breakpoint: 600,
                settings: {
                    dots: true
                }
            }]

        });
        $('.thumb-list').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite : true,
            asNavFor: '.slide-list',
            autoplay: true,
            autoplaySpeed:10000,
            arrows: false,
            focusOnSelect: true
        });

    }

    destroySlickSlider() {
        if ($('.slide-list').hasClass('slick-initialized')) {
            $('.slide-list').slick('destroy');
        }
        if ($('.thumb-list').hasClass('slick-initialized')) {
            $('.thumb-list').slick('destroy');
        }
    }


    favories(){
        if(this.curMember){
            if(this.detailPlans.hasFavorited == 0) {
                this.app.post('top_commons/favorite/add',{id:this.plan_id,model:1}).then(res=>{
                    if(res.status == 200){
                        this.detailPlans.hasFavorited = 1;
                        this.app.number_on_header.count_favourites = this.app.number_on_header.count_favourites + 1;
                    }else {
                        alert(res.json()['message']);
                    }
                });
            } else {
                this.app.post('top_commons/favorite/delete',{id:this.plan_id,model:1}).then(res=>{
                    if(res.status == 200){
                        this.app.number_on_header.count_favourites = this.app.number_on_header.count_favourites - 1;
                        this.detailPlans.hasFavorited = 0;
                    }else {
                        alert(res.json()['message']);
                    }
                });
            }
        } else {
            this.router.navigate(["/" + this.languageName + "/member/login"], { queryParams: { is_page: this.app.constant.TOUR_DETAIL, id: this.plan_id } });
        }


    }


    separateDataOnWeek(data) {
        // add days to full first week
        let dayofweek = parseInt(data[0].dayofweek);
        if (dayofweek != 7){
            for(let i = 0; i < dayofweek; i ++){
                data.unshift({});
            }
        }
        // separate week to each array from data
        let data_month = this.chunk(data, 7);
        return data_month
    }
    //separate from one array to multi array on per week on calendar
    chunk(arr, len = 7) {
        var chunks = [],
            i = 0,
            length = arr.length;
        while (i < length) {
            chunks.push(arr.slice(i, i += len));
        }
        return chunks;
    }
    goToBooking(date){
        if(date == 'undefined' || date == 'no_date'){
        } else {
            if(this.curMember){
                if(this.guiders['id'] == this.curMember.id){
                    alert(this.app.ttrans('自分の旅プランを予約できません。'));
                } else {
                    if(this.selectedDate.indexOf(date.toString()) != -1){
                        this.app.setConfig('GUIDER_PLAN_DATE',date);
                        this.router.navigate([this.languageName + '/reservation/' + this.plan_id])
                    } else {
                    }
                }

            } else {
                this.router.navigate(["/" + this.languageName + "/member/login"], { queryParams: { is_page: this.app.constant.BOOKING_PLAN, id: this.plan_id } });
            }

        }

    }
    goToBookingF04(){
        if(this.curMember){
            if(this.guiders && this.guiders['id'] == this.curMember.id){
                alert(this.app.ttrans('自分の旅プランを予約できません。'));
            }else {
                this.app.plan_language_id = this.app.plan_language_id ? this.app.plan_language_id : this.app.top_lang_id;
                this.router.navigate([this.languageName + '/reservation/' + this.plan_id])
            }
        }else {
            this.router.navigate(["/" + this.languageName + "/member/login"], { queryParams: { is_page: this.app.constant.BOOKING_PLAN, id: this.plan_id } });

        }

    }

    sendMailAll(){
        if(this.curMember){
            $('.error-message-des').html('');
            $('.error-message-mail').html('');
            $('#mail_to').val('');
            $('#mail_desc').val('');
            $(".modal-dialog").css("display","block");
            this.Email.email = $('#mail_to').val();
            this.Email.content = $('#mail_desc').val();
        }else {
            // alert(this.app.ttrans('共有するためにログインしてください。'));
            this.router.navigate(["/" + this.languageName + "/member/login"], { queryParams: { is_page: this.app.constant.TOUR_DETAIL, id: this.plan_id } });
        }

    }
    sendMail(){
        this.Email.plan_id = this.plan_id;
        this.Email.email = $('#mail_to').val();
        this.Email.content = $('#mail_desc').val();
        this.Email.title = this.detailPlans['title'];
        this.app.post('sendMail',this.Email).then(res=>{
            if(res.status == 200){
                $(".modal-dialog").css("display","none");
                $('.error-message-des').html('');
                $('.error-message-mail').html('');
            }else {
                if(res.json().email){
                    $('.error-message-mail').html('');
                    $('.error-message-mail').append(this.app.ttrans(res.json().email[0]));
                }
                if(res.json().email == 'undefined' || res.json().email == null || res.json().email == '' || !res.json().email){
                    $('.error-message-mail').html('');
                }
                if(res.json().content){
                    $('.error-message-des').html('');
                    $('.error-message-des').append(this.app.ttrans(res.json().content[0]));
                }
                if(res.json().content == 'undefined' || res.json().content == null || res.json().content == '' || !res.json().content){
                    $('.error-message-des').html('');
                }
            }
        });
    }

    getCalendar(monthPlan,yearPlan){
        this.app.get('guide_plan_detail_calendar',{month:monthPlan,year:yearPlan,plan_id: this.plan_id, language_id: this.language_id}).then(res => {
            if(res.status == 200){
                this.detailPlanCalendar = res.json().data.plan_calendar;
                this.plan_year = res.json().data.plan_year;
                this.plan_month = res.json().data.plan_month;
                this.selectedDate = res.json().data.plan_selected;
                if(this.detailPlanCalendar.length > 0) {
                    var modifyData = {list: []};
                    modifyData.list = this.separateDataOnWeek(this.detailPlanCalendar);
                    this.modifyData = modifyData;
                }
            }

        });
    }

    clickMonth(month, year, click) {
        let currentMonth = parseInt(month);
        let currentYear = parseInt(year);
        var is_click;
        if (click == 'next') {
            if (month == 12) {
                currentMonth = 1;
                currentYear = currentYear + 1;
            }
            if (month < 12) {
                currentMonth = currentMonth + 1;
            }

        } else {
            if (this.currentYear < currentYear) {
                if (month == 1) {
                    currentMonth = 12;
                    currentYear = currentYear - 1;
                }
                if (month > 1) {
                    currentMonth = currentMonth - 1;
                }
            } else {
                if (this.currentYear == currentYear) {
                    if (month > this.currentMonth) {
                        currentMonth = currentMonth - 1;
                    }
                    if (month <= this.currentMonth) {
                        currentMonth = this.currentMonth;
                    }
                }
                if (this.currentYear > currentYear) {
                    currentMonth = this.currentMonth;
                    currentYear = this.currentYear
                }
            }
        }

        this.getCalendar(currentMonth, currentYear);
    }
    close_modal(){
        $(document).on('click', '#close_modal', function () {
            $(".modal-dialog").css("display","none");
        });
    }

    backToSearch(category_prefix){
        let category = [];
        this.fb.form.value['category_prefix'] = category_prefix;
        category.push(category_prefix);
        this.fb.form.value['category_prefix'] = category;
        let url = this.app.genarateUrlSearchTour(this.fb.form.value);
        this.router.navigate([this.languageName+'/search/'+url]);
    }
    backToSearchPrefecture(){
        this.fb.form.value['category_prefix'] = [];
        this.fb.form.value['city_prefix'] =  this.prefecture['prefix'];
        let url = this.app.genarateUrlSearchTour(this.fb.form.value);
        this.router.navigate([this.languageName+'/search'+url]);
    }
    setTitleAndDescription() {
        if(this.languageName == ''){
            this.app.setTitle(this.guiders['name']+this.app.ttrans('の')+this.detailPlans['title'] + '　l　マッチングガイド - MATCHING GUIDE');
        }else {
            this.app.setTitle('Detail of  the travel plan  - MATCHING GUIDE');
        }
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('The details of  the travel plan."MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

    seeFull(item){
            $('.limit-'+item).hide();
            $('.full-'+item).show();
    }
    seeFullIntroduce(){
        $('.limit-introduce').hide();
        $('.full-introduce').show();
    }
    loadMore() {
    this.app.get('guide_plan_detail_other_plans',{plan_id: this.plan_id, language_id: this.language_id,page: this.detailPlanOthers.current_page + 1}).then(res => {
                if (res.status == 200) {
                    let data = res.json().data;
                    this.detailPlanOthers.current_page = data.current_page;
                    this.detailPlanOthers.last_page = data.last_page;
                    this.detailPlanOthers.data = this.detailPlanOthers.data.concat(data.data);
                }
            });
    }

}