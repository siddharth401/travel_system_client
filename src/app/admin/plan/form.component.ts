import {Component, OnInit} from '@angular/core';
import {AppService} from "../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {UploadService} from "../../shared/upload/upload.service";
import {FormData} from '../../shared/form-data';
//google map
import {AgmCoreModule} from '@agm/core';
import {ElementRef, NgZone, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {} from 'googlemaps';
import {MapsAPILoader} from '@agm/core';
import {forEach} from "@angular/router/src/utils/collection";


@Component({
    selector: 'admin-city-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
    private checkedCategory = [];
    private listGuide = {};
    private listCategory = {};
    private listLanguage = {};
    private listLanguageSupport = {};
    private listCountry = {};
    private listCity = {};
    private checked = [];
    private paramLanguage;
    private addressMeeting;
    private statusApprove;
    private nonApprove;
    private postedLanguage;
    private language_error = [];
    private time_err = [];
    private hasImages = [];
    private plan_images;
    private member;
    private currentID;
    private currentLanguageID;
    private show_time_request;
    private approvePlanContent = "";
    private showStatus;
    private approved;
    private checkImages = [];
    private default = 'btn btn-default';
    private apiKey = "AIzaSyC4fYabfPRCCvj6IhONDlnTbCBAUxwmkd4";
    private location = "Tokyo,Japan";
    private urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=' + this.location + '&zoom=16&maptype=roadmap&language=ja&region=JP';
    private fb;
    private confirmStatus;
    private time_request_error;
    private data =
        {
            id: '',
            member_id: '',
            time_request: '',
            time_apply: this.app.constant.Guider.time_apply.TIME_REQUIRED,
            meal: '',
            content: '',
            guide_perparation: '',
            guest_perparation: '',
            country_id: '',
            city_id: '',
            address_meeting: '',
            status: this.app.constant.GuiderStatus.APPROVAL_REQUEST,
            min_people: '',
            max_people: '',
            num_before_deadline: '',
            proposal_title: '',
            approve_plan: '',
            date_plan: '',
            num_plan: '',
            num_comments: '',
            num_reviews: '',
            period_setting: '',
            price: '',
            price_unit: '',
            rating: '',
            request_id: '',
            start_time: '',
            language_id: '',
            plan_content: '',
            latitude: '',
            longitude: '',
            participation_case:'',
            other:'',
            time_resquest_hour:'',
            time_resquest_min:'',
        };
    private dataLanguage =
        {
            name: '',
            language_id: '',
            lang_err: '',
        };
    private timeStart =
        {
            id: '',
            time_start_hour: '',
            time_start_min: '',
            time_start: '',
        }
    private dataImages = {
        image: '',
    }
    private guider = [];
    private plan_categories_error = [];
    private cancel_error = [];
    private languageSelectedJapan = true;

    constructor
    (private app: AppService,
     private route: ActivatedRoute,
     private router: Router,
     private upload: UploadService,) {
    }

    ngOnInit() {
        this.getCheckedCategory();
        this.getListGuide();
        this.getListLanguageSupport();
        this.getListLanguageContent();
        // this.getListCountry();
        this.route.params.subscribe((params) => {
            if (params['id'] && params['language_id']) {
                this.currentID = params['id'];
                this.currentLanguageID = params['language_id'];
                this.getListCountryByLanguage(params['language_id']);
                this.initPlan(params['id'], params['language_id']);
                this.fb = new FormData(this.app, this.data);
                this.fb.initChild('plan_categories', {});
                this.fb.initChild('plan_languages', this.dataLanguage);
                this.fb.initChild('plan_time_start', this.timeStart);
                this.fb.initChild('planImage', this.dataImages);
                this.fb.isNew = false;
                this.paramLanguage = params['language_id'];
                this.fb.bindData('plans/detail', {id: params['id'], language_id: params['language_id']});
            } else {
                this.getListCountryByLanguage(this.app.constant.JA_LANGUAGE_ID);
                this.fb = new FormData(this.app, this.data);
                this.fb.initChild('plan_categories', {});
                this.fb.initChild('plan_languages', this.dataLanguage);
                this.fb.initChild('plan_time_start', this.timeStart);
                this.fb.initChild('planImage', this.dataImages);
                this.fb.addItem('plan_languages');
                this.fb.addItem('plan_time_start');
                this.fb.addItem('planImage');
                this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=' + this.location + '&zoom=16&maptype=roadmap&language=ja&region=JP';
            }
        });

    }

    ngAfterViewChecked() {
        $('.select2-selection__rendered').text(this.guider[0]);
        if (this.fb.isNew == true) {
            $('.select2-results__message').remove();
            $('.select2-selection__arrow').css({"display": "none"});
            if ($('.image').length >= 10) {
                $('.hideImage').hide();
            } else {
                $('.hideImage').show();
            }
        } else {
            if ($('.image').length + $('.detail-img').length >= 10) {
                $('.hideImage').hide();
            } else {
                $('.hideImage').show();
            }
        }

    }

    initPlan(id, language_id) {
        this.app.get('plans/detail', {id: id, language_id: language_id}).then(res => {
            if (res.status == 200) {
                this.postedLanguage = language_id;
                this.plan_images = res.json().data.plan_images;
                this.statusApprove = res.json().data.status;
                this.nonApprove = res.json().data.plan_approves_content;
                var countryDetail = res.json().data.country_id;
                var prefectureDetail = res.json().data.city_id;
                var address = res.json().data.address_meeting;
                var country = '日本';
                var prefecture = '';
                if (countryDetail == null) {
                    this.listCity = {};
                    if(language_id == this.app.constant.TRUE){
                        this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=' + this.location + '&zoom=16&maptype=roadmap&language=ja&region=JP';
                    }else {
                        this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=' + this.location + '&zoom=16&maptype=roadmap&language=en&region=JP';
                    }
                    this.changeMap(language_id);
                } else {
                    this.app.get('cities/list_by_country',{'country_id': countryDetail,'language_id':this.currentLanguageID}).then(res => {
                        if (res.status == 200) {
                            this.listCity = this.app.arrToList(res.json().data, 'id', 'name');
                            $.each(this.listCity, function (index, value) {
                                if (prefectureDetail == index) {
                                    prefecture = value;
                                }
                            });
                            this.location = country + prefecture + address;
                            this.listCity = this.app.arrToList(res.json().data, 'id', 'name');
                            this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=' + this.location + '&zoom=16&maptype=roadmap&language=ja&region=JP';
                            this.changeMap(language_id);

                        }
                    });
                }
                let time_request = res.json().data.time_request.split(':');
                $('#time_request_hour').val(time_request[0]);
                $('#time_request_min').val(time_request[1]);
            }
        });
    }

    getCheckedCategory() {
        this.route.params.subscribe((params) => {
            if (params['id'] && params['language_id']) {
                this.app.get('plans/detail', {id: params['id'], language_id: params['language_id']}).then(res => {
                    if (res.status == 200) {
                        this.checkedCategory = res.json().data.plan_categories;
                        this.plan_images = res.json().data.plan_images;
                    }
                });
            }
        });
    }

    getListGuide() {
        this.app.get('members', {'active': 1, 'type': 2}).then(res => {
            if (res.status === 200) {
                this.listGuide = this.app.arrToList(res.json().data, 'id', 'name');
                this.guider = this.app.pushToArr(res.json().data, 'id', 'name');
            }
        });
    }
    getListCountryByLanguage(language_id){
        this.app.get('countries/list_by_language',{'language_id':language_id}).then(res=>{
            if(res.status == 200){
                this.listCountry = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    getListCity(country_id) {
        if (country_id == '') {
            this.listCity = {};
        } else {
            let language_id = this.app.constant.TRUE;
            $.each(this.listLanguage, function (index, value) {
                if (value == $('.btn-warning').attr('id')) {
                    language_id = index;
                }
            });
            if(language_id){
                this.app.get('cities/list_by_country',{'country_id': country_id,'language_id':language_id}).then(res => {
                    if (res.status == 200) {
                        this.listCity = this.app.arrToList(res.json().data, 'id', 'name');
                    }
                });
            }

        }
    }

    getListLanguageContent() {
        var langID;
        this.app.get('languages', {'active': 1, 'is_display': 1}).then(res => {
            if (res.status === 200) {
                this.listLanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
                $.each(this.listLanguage, function (index, value) {
                    if (value == '日本語') {
                        langID = index;
                    }
                });
                this.route.params.subscribe((params) => {
                    if (params['id'] && params['language_id']) {
                        this.app.get('categories/get_categories_by_language', {language_id: params['language_id']}).then(res => {
                            if (res.status == 200) {
                                this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
                            }
                        });
                    } else {
                        this.app.get('categories/get_categories_by_language', {language_id: langID}).then(res => {
                            if (res.status == 200) {
                                this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
                            }
                        });
                    }
                });


            }
        });
    }

    getListLanguageSupport() {
        this.app.get('languages', {'active': 1, 'is_support': 1}).then(res => {
            if (res.status === 200) {
                this.listLanguageSupport = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }

    reset() {
        $("#proposal_title").val("");
        $("#meal").val("");
        $("#plan_content").val("");
        $("#guide_perparation").val("");
        $("#guest_perparation").val("");
        $("#plan_approves_content").val("");

    }

    changeEnglishNewForm(value,key) {
        var langID;
        let iDSelect = '#' + value;
        if ($(iDSelect).hasClass("btn-warning")) {
            $('#formConfirmChangeEnglish').modal('hide');
        }
        else {
            $('.switch-language').append(value);
            $('#formConfirmChangeEnglish').modal('show');
            $('#changeLanguageEnglish').click(function () {
                $('#formConfirmChangeEnglish').modal('hide');
                $('.switch-language').text('');
                $('.langBtn').removeClass('btn-warning');
                $(iDSelect).addClass('btn-warning');
                if(key == 1){
                    $('.text-country').html('日本');
                }else {
                    $('.text-country').html('Japan');
                }
            });
        }
        if (this.fb.isNew == true) {
            this.app.get('categories/get_categories_by_language', {language_id: key}).then(res => {
                if (res.status == 200) {
                    this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
                }
            });
            this.app.get('cities/list_by_country',{'country_id': 1,'language_id':key}).then(res => {
                if (res.status == 200) {
                    this.listCity = this.app.arrToList(res.json().data, 'id', 'name');
                }
            });
        }

        if($(".prefecture-select option:selected").val() != ''){
            this.changeMap(key);
        }else {
            if(key == this.app.constant.TRUE){
                this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=Tokyo,Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
            }else {
                this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=Tokyo,Japan&zoom=16&maptype=roadmap&language=en&region=JP';
            }
        }
        // this.changeMap(key);
        this.getListCountryByLanguage(key);
    }
    cancelChangeLanguage(){
        $('#formConfirmChangeEnglish').modal('hide');
        $('.switch-language').text('');
        let language_id_plan = $('.btn-warning').val();
        this.app.get('categories/get_categories_by_language', {language_id: language_id_plan}).then(res => {
            if (res.status == 200) {
                this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });

        this.app.get('cities/list_by_country',{'country_id': 1,'language_id':language_id_plan}).then(res => {
            if (res.status == 200) {
                this.listCity = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
        if($(".prefecture-select option:selected").val() != ''){
            this.changeMap(language_id_plan);
        }else {
            if(language_id_plan == this.app.constant.TRUE){
                this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=Tokyo,Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
            }else {
                this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=Tokyo,Japan&zoom=16&maptype=roadmap&language=en&region=JP';
            }
        }
        this.getListCountryByLanguage(language_id_plan);
    }

    updateCheckedOptions(optionRole, event) {
        if (event.target.checked) {
            this.fb.form.controls.plan_categories.value.push(parseInt(optionRole));
        }
        else {
            while (this.fb.form.controls.plan_categories.value.indexOf(parseInt(optionRole)) !== -1) {
                this.fb.form.controls.plan_categories.value.splice(this.fb.form.controls.plan_categories.value.indexOf(parseInt(optionRole)), 1);
            }
        }
        this.checked = this.fb.form.controls.plan_categories.value;
    }

    changeStatus(valueKey, column, model, valueColumnChange) {
        if (confirm(this.app.trans("Would you like to approved"))) {
            this.app.post('plans/changeActive', {
                valueKey: valueKey,
                column: column,
                model: model,
                valueColumnChange: valueColumnChange,
                language_id:this.currentLanguageID
            }).then(res => {
                if (res.status == 200) {
                    this.statusApprove = this.app.constant.GuiderStatus.PUBLIC_OFFERING;
                    window.scrollTo(0, 0);
                    this.app.adminFlashSuccess(this.app.trans('Plan has been approved'), true);
                    $('.hide-approve').hide();
                    // $('.show-approved').show();
                    $('.status-plan').val(this.app.constant.GuiderStatus.PUBLIC_OFFERING);
                }
            });
        } else {
            //Nothing
        }
    }

    cancelApprove(valueKey, column, model, valueColumnChange) {
        if ($('#plan_approves_content').val() != '') {
            if (confirm(this.app.trans("Would you like to rejected"))) {
                this.app.post('plans/cancelActive', {
                    valueKey: valueKey,
                    column: column,
                    model: model,
                    valueColumnChange: valueColumnChange,
                    planApprovesContent: $('#plan_approves_content').val(),
                    language_id:this.currentLanguageID
                }).then(res => {
                    if (res.status == 200) {
                        this.statusApprove = this.app.constant.GuiderStatus.NON_APPROVAL;
                        window.scrollTo(0, 0);
                        this.app.adminFlashSuccess(this.app.trans('Plan has been rejected'), true);
                        $('.hide-approve').hide();
                        this.approvePlanContent = $('#plan_approves_content').val();
                        this.nonApprove = $('#plan_approves_content').val();
                    }else {
                        this.cancel_error = res.json();
                    }
                });
            } else {
                //Nothing
            }
        }else {
            alert(this.app.trans('Please write down the content of disapproval.'));
        }

    }

    changeMap(plan_language_id) {
        if ($(".country-select option:selected").val() != '') {
            let country = $(".country-select option:selected").text();
            let prefecture = $(".prefecture-select option:selected").text();
            let address = $('#address_meeting').val();
            this.location = address +','+ prefecture +','+ country;
            if(plan_language_id == this.app.constant.TRUE){
                if(parseInt($(".country-select option:selected").val()) == parseInt(this.app.constant.COUNTRY_DEFAULT)){
                    this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=' + this.location + '&zoom=16&maptype=roadmap&language=ja&region=JP';
                }else {
                    this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=' + this.location + '&zoom=16&maptype=roadmap&language=ja';
                }
            }else {
                if(parseInt($(".country-select option:selected").val()) == parseInt(this.app.constant.COUNTRY_DEFAULT)){
                    this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=' + this.location + '&zoom=16&maptype=roadmap&language=en&region=JP';
                }else {
                    this.urlMap = 'https://www.google.com/maps/embed/v1/place?key=' + this.apiKey + '&q=' + this.location + '&zoom=16&maptype=roadmap&language=en';
                }
            }
        }
    }

    removeImage(idImage) {
        $('#' + idImage).remove();
        $('.' + idImage).remove();
        if (this.fb.isNew == false && $('.image').length == 0 && $('.detail-img').length == 0) {
            this.fb.addItem('planImage');
        }
    }

    save(confirm?: false) {
        this.cancel_error = [];
        if (this.fb.isNew == false) {
            this.fb.form.value['language_id'] = this.paramLanguage;
        } else {
            if ($('.langBtn.btn-warning').length != 0) {
                var langID;
                var currentID = $('.langBtn.btn-warning').find('#value-language')['prevObject'][0].id;
                $.each(this.listLanguage, function (index, value) {
                    if (currentID == value) {
                        langID = index;
                    }
                });
            } else {
                $.each(this.listLanguage, function (index, value) {
                    if (value == 'Japnanese' || value == 'English') {
                        langID = index;
                    }
                });
            }
            this.postedLanguage = langID;
            this.fb.form.value['language_id'] = langID;
        }
        this.fb.form.value['proposal_title'] = $('#proposal_title').val();
        this.fb.form.value['meal'] = $('#meal').val();
        this.fb.form.value['min_people'] = $("#min_people").val();
        this.fb.form.value['max_people'] = $("#max_people").val();
        // this.fb.form.value['plan_content'] = $("#plan_content").val();
        this.fb.form.value['guide_perparation'] = $("#guide_perparation").val();
        this.fb.form.value['guest_perparation'] = $("#guest_perparation").val();
        this.fb.form.value['address_meeting'] = $("#address_meeting").val();
        this.fb.form.value['country_id'] = $(".country-select :selected").val();
        this.fb.form.value['city_id'] = $(".prefecture-select :selected").val();
        if (this.fb.isNew == false) {
            this.fb.form.value['plan_approves_content'] = $("#plan_approves_content").val();
        }
        this.addressMeeting = $("#address_meeting").val();
        if(this.fb.isNew == false && $('.status-plan').length > 0){
            this.fb.form.value['status'] = $('.status-plan').val();
            this.confirmStatus = $('.status-plan').val();
        }

        //plan category
        let category = [];
        if( $('.checkbox:checkbox:checked').length > 0){
            $('.checkbox:checkbox:checked').each(function () {
                category.push($(this).val());
            });
        }
        this.fb.form.value['plan_categories'] = category;
        this.checked = category;

        // plan_images
        if ($('.image').length > 0) {
            for (let i = 1; i <= $('.image').length; i++) {
                this.fb.form.value['image-' + i] = this.upload.getDataFile('image-' + i);
            }
        }
        // handl detail image
        if (this.fb.isNew == false && this.plan_images) {
            let hasImg = [];
            let imgDetail = [];
            $.each($('.detail-img'), function (index, value) {
                hasImg.push($('.detail-img')[index].id);
                imgDetail.push($('.detail-img')[index].currentSrc);
            });
            this.hasImages = imgDetail;
            this.fb.form.value['non_changed_ids'] = hasImg;
            this.checkImages = hasImg;
        }
        // show image
        let showImage = [];
        let countImage = $('.image').length;
        if (countImage == 1 && $('input#image-1')[0].files[0]) {
            $('#show-image').html("");
            this.getImageSource('image-1', $('input#image-1')[0].files[0], function (data) {
                $('#show-image').append("<img src='" + data + "' width='50'>");
            });
            this.checkImages.push(1);
        }
        if (countImage == 2 && $('input#image-1')[0].files[0] && $('input#image-2')[0].files[0]) {
            $('#show-image').html("");
            for (let i = 1; i <= countImage; i++) {
                this.getImageSource('image-' + i, $('input#image-' + i)[0].files[0], function (data) {
                    $('#show-image').append("<img src='" + data + "' width='50'>");
                });
            }
            this.checkImages.push(1);
        }
        if (countImage == 3 && $('input#image-1')[0].files[0] && $('input#image-2')[0].files[0] && $('input#image-3')[0].files[0]) {
            $('#show-image').html("");
            for (let i = 1; i <= countImage; i++) {
                this.getImageSource('image-' + i, $('input#image-' + i)[0].files[0], function (data) {
                    $('#show-image').append("<img src='" + data + "' width='50'>");
                });
            }
            this.checkImages.push(1);
        }
        if (countImage == 4 && $('input#image-1')[0].files[0] && $('input#image-2')[0].files[0] && $('input#image-3')[0].files[0] && $('input#image-4')[0].files[0]) {
            $('#show-image').html("");
            for (let i = 1; i <= countImage; i++) {
                this.getImageSource('image-' + i, $('input#image-' + i)[0].files[0], function (data) {
                    $('#show-image').append("<img src='" + data + "' width='50'>");
                });
            }
            this.checkImages.push(1);
        }
        if (countImage == 5 && $('input#image-1')[0].files[0] && $('input#image-2')[0].files[0] && $('input#image-3')[0].files[0] && $('input#image-4')[0].files[0] && $('input#image-5')[0].files[0]) {
            $('#show-image').html("");
            for (let i = 1; i <= countImage; i++) {
                this.getImageSource('image-' + i, $('input#image-' + i)[0].files[0], function (data) {
                    $('#show-image').append("<img src='" + data + "' width='50'>");
                });
            }
            this.checkImages.push(1);
        }
        if (countImage == 6 && $('input#image-1')[0].files[0] && $('input#image-2')[0].files[0] && $('input#image-3')[0].files[0] && $('input#image-4')[0].files[0] && $('input#image-5')[0].files[0] && $('input#image-6')[0].files[0]) {
            $('#show-image').html("");
            for (let i = 1; i <= countImage; i++) {
                this.getImageSource('image-' + i, $('input#image-' + i)[0].files[0], function (data) {
                    $('#show-image').append("<img src='" + data + "' width='50'>");
                });
            }
            this.checkImages.push(1);
        }
        if (countImage == 7 && $('input#image-1')[0].files[0] && $('input#image-2')[0].files[0] && $('input#image-3')[0].files[0] && $('input#image-4')[0].files[0] && $('input#image-5')[0].files[0] && $('input#image-6')[0].files[0] && $('input#image-7')[0].files[0]) {
            $('#show-image').html("");
            for (let i = 1; i <= countImage; i++) {
                this.getImageSource('image-' + i, $('input#image-' + i)[0].files[0], function (data) {
                    $('#show-image').append("<img src='" + data + "' width='50'>");
                });
            }
            this.checkImages.push(1);
        }
        if (countImage == 8 && $('input#image-1')[0].files[0] && $('input#image-2')[0].files[0] && $('input#image-3')[0].files[0] && $('input#image-4')[0].files[0] && $('input#image-5')[0].files[0] && $('input#image-6')[0].files[0] && $('input#image-7')[0].files[0] && $('input#image-8')[0].files[0]) {
            $('#show-image').html("");
            for (let i = 1; i <= countImage; i++) {
                this.getImageSource('image-' + i, $('input#image-' + i)[0].files[0], function (data) {
                    $('#show-image').append("<img src='" + data + "' width='50'>");
                });
            }
            this.checkImages.push(1);
        }
        if (countImage == 9 && $('input#image-1')[0].files[0] && $('input#image-2')[0].files[0] && $('input#image-3')[0].files[0] && $('input#image-4')[0].files[0] && $('input#image-5')[0].files[0] && $('input#image-6')[0].files[0] && $('input#image-7')[0].files[0] && $('input#image-8')[0].files[0] && $('input#image-9')[0].files[0]) {
            $('#show-image').html("");
            for (let i = 1; i <= countImage; i++) {
                this.getImageSource('image-' + i, $('input#image-' + i)[0].files[0], function (data) {
                    $('#show-image').append("<img src='" + data + "' width='50'>");
                });
            }
            this.checkImages.push(1);
        }
        if (countImage == 10 && $('input#image-1')[0].files[0] && $('input#image-2')[0].files[0] && $('input#image-3')[0].files[0] && $('input#image-4')[0].files[0] && $('input#image-5')[0].files[0] && $('input#image-6')[0].files[0] && $('input#image-7')[0].files[0] && $('input#image-8')[0].files[0] && $('input#image-9')[0].files[0] && $('input#image-10')[0].files[0]) {
            $('#show-image').html("");
            for (let i = 1; i <= countImage; i++) {
                this.getImageSource('image-' + i, $('input#image-' + i)[0].files[0], function (data) {
                    $('#show-image').append("<img src='" + data + "' width='50'>");
                });
            }
            this.checkImages.push(1);
        }
        //select search
        if (this.fb.isNew == true) {
            var member_id;
            var memberName = $('.select2-selection__rendered').attr('title');
            if (memberName != '') {
                $.each(this.listGuide, function (key, value) {
                    if (value == memberName) {
                        member_id = key;
                    }
                });
            }
            this.member = $('.select2-selection__rendered').attr('title');
            this.fb.form.value['member_id'] = member_id;
        } else {
            this.member = $('.memberName').text();
        }
        this.fb.form.value['images'] = this.checkImages;

        // time
        if($('#time_request_hour').val() != '' && $('#time_request_min').val() != ''){
            this.fb.form.value['time_request'] = $('#time_request_hour').val()+':'+$('#time_request_min').val();
            this.show_time_request = $('#time_request_hour').val()+':'+$('#time_request_min').val();
        }else {
            this.fb.form.value['time_request'] = '';
        }
        this.fb.form.value['form_confirm'] = confirm;
        this.app.post('plans/save', this.fb.form.value).then(res => {
            if (res.status === 200) {
                if (confirm) {
                    $('#formConfirm').modal('show');
                }
                else {
                    $('#formConfirm').modal('hide');
                    this.app.adminFlashSuccess(this.app.trans('Data has been saved'), true);
                    window.scrollTo(0, 0);
                    if (this.fb.isNew == true) {
                        this.router.navigate(['admin/plan/list']);
                    } else {
                        this.nonApprove = this.fb.form.value['plan_approves_content'];
                        $('.image').remove();
                        $('.load-detail-image').remove();
                        this.language_error = [];
                        this.time_err = [];
                        this.initPlan(this.currentID, this.currentLanguageID);
                    }
                }
            } else {
                if(res.json()['time_request']){
                    this.time_request_error = res.json()['time_request'];
                }
                this.language_error = [];
                for (let i = 0; i < $('.language-err').length; i++) {
                    this.language_error.push(res.json()['plan_languages.' + i + '.language_id']);
                }
                this.time_err = [];
                for (let i = 0; i < $('.time_err').length; i++) {
                    this.time_err.push(res.json()['plan_time_start.' + i + '.time_start']);
                }
                if(res.json()['plan_categories']){
                    this.plan_categories_error = res.json()['plan_categories'];
                }
                if(res.json()['status']){
                    $('.date-stop-public').text(res.json()['status'][0]);
                    $('#cannotstop').modal('show');
                }
            }
        });
    }

    getImageSource(field, file, callback) {
        if (file.type.indexOf('image') != -1) {

            let reader = new FileReader();
            reader.onload = function (e) {
                let result = e.target['result'];
                callback(result);
            };
            reader.readAsDataURL(file);
            return;
        } else {
            let fileSource = this.app.constant.BASE_WEB + 'default/file-default.png';
            $('.confirm_' + field).attr('src', fileSource);
            callback(fileSource);
        }
    }

}
