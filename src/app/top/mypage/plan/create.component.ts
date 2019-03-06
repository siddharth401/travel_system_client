import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
import {UploadService} from "../../../shared/upload/upload.service";
import {split} from "ts-node/dist";


@Component({
    selector: 'mypage-plan-create',
    templateUrl: './create.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './create.component.css'
    ],
})
export class CreateComponent implements OnInit {
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router,
                private upload: UploadService) {
    }

    private curMember = this.app.getCurrentMember();
    private listPrefecture;
    private listlanguage;
    private listCategory;
    private checkedCategory = [];
    private Error = [];
    private imageError = [];
    private imageBackError = [];
    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private language_id_plan = this.app.constant.JA_LANGUAGE_ID;
    private selectLanguage = true;
    private listCountry;
    private data =
        {
            'form_confirm': true,
            'is_agree_conditions': true,
            'id': '',
            'member_id': this.curMember ? this.curMember.id : null,
            'time_request': '',
            'time_apply': this.app.constant.Guider.time_apply.TIME_REQUIRED,
            'meal': '',
            'content': '',
            'guide_perparation': '',
            'guest_perparation': '',
            'country_id': '',
            'city_id': '',
            'address_meeting': '',
            'status': this.app.constant.GuiderStatus.APPROVAL_REQUEST,
            'min_people': '',
            'max_people': '',
            'num_before_deadline': '',
            'proposal_title': '',
            'approve_plan': '',
            'date_plan': '',
            'num_plan': '',
            'num_comments': '',
            'num_reviews': '',
            'period_setting': '',
            'price': '',
            'price_unit': '',
            'rating': '',
            'request_id': '',
            'start_time': '',
            'language_id': this.app.getConfig('TOP_LANG_ID'),
            'plan_language_id':'',
            'plan_content': '',
            'latitude': '',
            'longitude': '',
            'plan_languages': [],
            'plan_time_start': [],
            'plan_categories': [],
            'images': 0,
            'other': '',
            'participation_case': '',

        };
    private location = "Tokyo,Japan";
    private addressMap = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=Tokyo,Japan&zoom=16&maptype=roadmap&language=ja&region=JP";
    private Languages = {'language': [{'language_id': ''}]};
    private timeStart = {'time': [{'plan_hour': '00', 'plan_min': '00'}]};
    private images = {'plan_images': [{'image': ''}]};
    private showImages = [];
    private confirmFormData;
    private selectedPrefecture;
    private country_select = this.app.constant.COUNTRY_DEFAULT;
    private selectedCountry = false;
    private checkedTimeApply = 1;
    private timeStartError = [];
    private languageError = [];
    private listLanguage;
    private createUploadImage = this.app.uploadImagePlans;
    private backtoCreate = false;
    private is_active = this.app.constant.TRUE;
    private showImageFromConfirm = [];
    private image_plan_create_confirm = [];


    ngOnInit() {
        this.app.checkAuthGuider();
        this.app.checkDisplayLanguage(this.languageName);
        this.app.curMember = this.app.getConfig('CURRENT_MEMBER') ? JSON.parse(this.app.getConfig('CURRENT_MEMBER')) : null;
        if(this.app.curMember && (!this.app.curMember.nick_name || this.app.curMember.nick_name == '')) {
            alert(this.app.ttrans("旅プランを作成する前にプロフィールにおいて、名前とニックネームを入力してください。"));
            this.router.navigate([this.app.language+'/mypage/profile']);
        }
        window.scroll(0, 0);
        this.getListCityByCountry();
        this.setTitleAndDescription();
        this.getListLanguage();
        this.getListLanguageContent();
        if (this.app.getConfig('confirmCreatePlan') && this.app.curMember) {
            this.backtoCreate = true;
            this.confirmFormData = JSON.parse(this.app.getConfig('confirmCreatePlan'));
            this.data = this.confirmFormData.formPlan;
            // this.language_id = this.confirmFormData.formPlan.language_id;
            this.language_id_plan = this.confirmFormData.formPlan.plan_language_id;
            this.Languages.language = this.confirmFormData.multiplelanguage.language;
            this.timeStart.time = this.confirmFormData.planHourMin.time;
            $('#plan-meal').val(this.confirmFormData.formPlan.meal);
            $('#content').val(this.confirmFormData.formPlan.content);
            $('#guide_perparation').val(this.confirmFormData.formPlan.guide_perparation);
            $('#guest_perparation').val(this.confirmFormData.formPlan.guest_perparation);
            $('#plan-address').val(this.confirmFormData.formPlan.address_meeting);
            $('#plan-name').val(this.confirmFormData.formPlan.proposal_title);
            $('#time_request_hour').val(this.confirmFormData.time_request_hour);
            $('#time_request_min').val(this.confirmFormData.time_request_min);
            $('#min_number').val(this.confirmFormData.formPlan.min_people);
            $('#max_number').val(this.confirmFormData.formPlan.max_people);
            $('#plan-price').val(this.confirmFormData.formPlan.price);
            // $('#language_plan').val(this.confirmFormData.formPlan.language_id);
            $('#plan-term').val(this.confirmFormData.formPlan.num_before_deadline);
            $('#other').val(this.confirmFormData.formPlan.other);
            $('#participation_case').val(this.confirmFormData.formPlan.participation_case);
            if (this.confirmFormData.formPlan.plan_language_id == this.app.constant.TRUE) {
                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.confirmFormData.formPlan.address_meeting + this.confirmFormData.prefectureText + this.confirmFormData.country_name +'&zoom=16&maptype=roadmap&language=ja';
            } else {
                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.confirmFormData.formPlan.address_meeting + this.confirmFormData.prefectureText +this.confirmFormData.country_name+ '&zoom=16&maptype=roadmap&language=en';
            }
            this.selectedPrefecture = parseInt(this.confirmFormData.formPlan.city_id);
            this.country_select = parseInt(this.confirmFormData.formPlan.country_id);
            this.checkedTimeApply = parseInt(this.confirmFormData.formPlan.time_apply);
            this.selectedCountry = true;
            this.checkedCategory = this.confirmFormData.categories;
            if (this.app.uploadImagePlans.length > 0) {
                for (let i = 1; i <= 10; i++) {
                    delete this.data['image-' + i];
                }
                let image_back_to_confirm = [];
                let dataUpload = this.app.uploadImagePlans;
                for (let i = 0; i < dataUpload.length; i++) {
                    this.getImageSource('image-' + (i + 1), dataUpload[i], function (data) {
                        image_back_to_confirm.push({key: i, name: dataUpload[i].name, src: data});
                    });
                }
                this.showImageFromConfirm = image_back_to_confirm;
            }
            if (this.confirmFormData.formPlan.plan_language_id == 1 || this.confirmFormData.formPlan.plan_language_id == 2) {
                this.app.get('categories/get_categories_by_language', {language_id: this.confirmFormData.formPlan.plan_language_id}).then(res => {
                    if (res.status == 200) {
                        this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');

                    }
                });
            } else {
                this.app.get('categories/get_categories_by_language', {language_id: 2}).then(res => {
                    if (res.status == 200) {
                        this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
                    }
                });
            }
            this.app.get('cities/list_by_country', {
                'language_id': this.confirmFormData.formPlan.plan_language_id,
                'country_id': this.confirmFormData.formPlan.country_id
            }).then(res => {
                if (res.status == 200) {
                    this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                }
            });
            this.getListCountry(this.confirmFormData.formPlan.plan_language_id);


            this.is_active = this.confirmFormData.formPlan.plan_language_id;
            if (this.confirmFormData.formPlan.plan_language_id == this.app.constant.TRUE) {
                this.selectLanguage = true;
            } else {
                this.selectLanguage = false;
            }

        } else if(this.app.curMember) {
            this.selectLanguage = true;
            this.getCategoryDefault(this.language_id_plan);
            this.getListPrefectureDefault(this.language_id_plan);
            this.getListCountry(this.language_id_plan);
        }

    }

    getListLanguageContent() {
        this.app.get('languages', {'active': 1, 'is_display': 1}).then(res => {
            if (res.status === 200) {
                this.listLanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }

    deleteImage() {
    }

    getCategoryDefault(language_id) {
        this.app.get('categories/get_categories_by_language', {language_id: language_id}).then(res => {
            if (res.status == 200) {
                this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');

            }
        });
    }

    getListPrefectureDefault(language_id) {
        this.app.get('cities/list_by_country', {
            'language_id': language_id,
            'country_id': this.app.constant.TRUE
        }).then(res => {
            if (res.status == 200) {
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    changePlanlanguage(key, value) {
        var langID;
        let iDSelect = '#' + value;
        if ($(iDSelect).hasClass("active")) {
            $('#formConfirmChangeEnglish').css("display", "none");
        }
        else {
            if(this.language_id == this.app.constant.JA_LANGUAGE_ID){
                $('.switch-language-ja').append(this.app.ttrans(value));
            }else {
                $('.switch-language-en').append(this.app.ttrans(value));
            }
            $('#formConfirmChangeEnglish').css("display", "block");
            $('#changeLanguageEnglish').click(function () {
                $('#formConfirmChangeEnglish').css("display", "none");
                $('.switch-language-ja').text('');
                $('.switch-language-en').text('');
                $('.btn-lang').removeClass('active');
                $(iDSelect).addClass('active');
            });
        }
        this.app.get('categories/get_categories_by_language', {language_id: key}).then(res => {
            if (res.status == 200) {
                this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });

        if (key == this.app.constant.EN_LANGUAGE_ID || key != this.app.constant.JA_LANGUAGE_ID) {
            this.app.get('cities/list_by_country', {
                'language_id': key,
                'country_id': $('.plan-contory :selected').val()
            }).then(res => {
                if (res.status == 200) {
                    this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                }
            });
            this.selectLanguage = false;
            this.addressMap = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=Tokyo,Japan&zoom=16&maptype=roadmap&language=en&region=JP";
        } else {
            this.app.get('cities/list_by_country', {
                'language_id': key,
                'country_id': $('.plan-contory :selected').val()
            }).then(res => {
                if (res.status == 200) {
                    this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                }
            });
            this.addressMap = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=Tokyo,Japan&zoom=16&maptype=roadmap&language=ja&region=JP";
            this.selectLanguage = true;
        }
        this.country_select = $('.plan-contory :selected').val();
        this.getListCountry(key);
    }

    cancelLanguage() {
        $('#formConfirmChangeEnglish').css("display", "none");
        $('.switch-language-ja').text('');
        $('.switch-language-en').text('');
        // });
        let key = $('.active').val();
        this.app.get('categories/get_categories_by_language', {language_id: key}).then(res => {
            if (res.status == 200) {
                this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
        this.app.get('cities/list_by_country', {
            'language_id': key,
            'country_id': $('.plan-contory :selected').val()
        }).then(res => {
            if (res.status == 200) {
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
        if (key == this.app.constant.EN_LANGUAGE_ID || key != this.app.constant.JA_LANGUAGE_ID) {
            this.selectLanguage = false;
            this.addressMap = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=Tokyo,Japan&zoom=16&maptype=roadmap&language=en&region=JP";
        } else {
            this.selectLanguage = true;
            this.addressMap = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=Tokyo,Japan&zoom=16&maptype=roadmap&language=ja&region=JP";
        }
        this.getListCountry(key);
        this.country_select = $('.plan-contory :selected').val();

    }

    reset() {
        $('#plan-meal').val("");
        $('#content').val("");
        $('#guide_perparation').val("");
        $('#guest_perparation').val("");
        $('#other').val("");
        $('#participation_case').val("");
        $('#plan-address').val("");
        $('#plan-name').val("");
        $('#min_number').val("");
        $('#max_number').val("");
    }

    getListCityByCountry() {
        if (this.language_id == this.app.constant.JA_LANGUAGE_ID) {
            this.app.get('cities/list_by_country', {'language_id': this.language_id, 'country_id': 1}).then(res => {
                if (res.status == 200) {
                    this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                }
            });
        } else {
            this.app.get('cities/list_by_country', {
                'language_id': this.app.constant.EN_LANGUAGE_ID,
                'country_id': this.app.constant.JA_LANGUAGE_ID
            }).then(res => {
                if (res.status == 200) {
                    this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                }
            });
            this.selectLanguage = false;
        }

    }

    getListLanguage() {
        this.app.get('languages', {'active': 1, 'is_support': this.app.constant.TRUE}).then(res => {
            if (res.status == 200) {
                this.listlanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }

    addLanguage() {
        this.Languages.language.push({'language_id': ''});
    }

    removeLanguage(index = 0) {
        this.Languages.language.splice(index, 1);
        $('.error-language-' + index).remove();
        this.languageError.splice(index, 1);
    }

    addImage() {

        if($('input#image-10').is(':hidden') == true){
            $('.upload-image-back-from-confirm').css("display", "block");
        }else {
            if ($('.image').length + $('.block-image').length < 10) {
                this.images.plan_images.push({'image': ''});
            }
        }

    }

    removeImage(index = 0) {
        $('.error-image-' + index).remove();
        this.imageError.splice(index, 1);
        this.imageBackError.splice(index, 1);
        if($('.image').length > 1 && $('.block-image').length == 0){
            this.images.plan_images.splice(index, 1);
        }
        if($('.image').length == 1 && $('.block-image').length > 0 ){
            this.images.plan_images.splice(index, 1);
        }
    }

    addTime() {
        this.timeStart.time.push({'plan_hour': '00', 'plan_min': '00'});
    }

    removeTime(index = 0) {
        this.timeStart.time.splice(index, 1);
        $('.error-time-' + index).remove();
        this.timeStartError.splice(index, 1);
    }

    changeMap() {
        let key = $('.active').val();
        if ($("#plan-contory option:selected").val() != '') {
            let country = $("#plan-contory option:selected").text();
            let prefecture = $("#plan-prefecture :visible") == true ? $("#plan-prefecture option:selected").text() : '';
            let address = $('#plan-address').val();
            this.location = address + ',' + prefecture + ',' + country;
            if(parseInt($("#plan-contory option:selected").val()) == this.app.constant.COUNTRY_DEFAULT ) {
                if (key == this.app.constant.TRUE) {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.location + '&zoom=16&maptype=roadmap&language=ja&region=JP';
                } else {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.location + '&zoom=16&maptype=roadmap&language=en&region=JP';
                }
            }else {
                if (key == this.app.constant.TRUE) {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.location + '&zoom=16&maptype=roadmap&language=ja';
                } else {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.location + '&zoom=16&maptype=roadmap&language=en';
                }
            }


        }
    }

    confirmSave() {
        this.data.meal = $('#plan-meal').val();
        this.data.content = $('#content').val();
        this.data.guide_perparation = $('#guide_perparation').val();
        this.data.guest_perparation = $('#guest_perparation').val();
        this.data.other = $('#other').val();
        this.data.participation_case = $('#participation_case').val();
        this.data.address_meeting = $('#plan-address').val();
        this.data.proposal_title = $('#plan-name').val();
        this.data.time_request = $('#time_request_hour').val() + ":" + $('#time_request_min').val();
        this.data.min_people = $('#min_number').val();
        this.data.max_people = $('#max_number').val();
        this.data.num_before_deadline = $('#plan-term').val();
        this.data.country_id = $('.plan-contory').val();
        this.data.city_id = $('#plan-prefecture').val();
        this.data.plan_language_id = $('.active').val();
        this.data.price = $('#plan-price').val();
        if ($('#plan-limit-01').is(':checked') == true) {
            this.data.time_apply = this.app.constant.Guider.time_apply.TIME_REQUIRED;
        }
        if ($('#plan-limit-02').is(':checked') == true) {
            this.data.time_apply = this.app.constant.Guider.time_apply.RESERVE_TIME;
        }
        if ($('#plan-limit-03').is(':checked') == true) {
            this.data.time_apply = this.app.constant.Guider.time_apply.DAILY_RESERVATION;
        }
        //time_start
        if (this.timeStart.time) {
            var time_start = [];
            $.each(this.timeStart.time, function (index, value) {
                time_start.push({'time_start': value.plan_hour + ':' + value.plan_min});
            });
            this.data.plan_time_start = time_start;
        }
        //languages support
        if (this.Languages.language) {
            var languages = [];
            $.each(this.Languages.language, function (index, value) {
                languages.push({'language_id': value.language_id});
            });
            this.data.plan_languages = languages;
        }
        //categories
        let category = [];
        $('.checkbox:checkbox:checked').each(function () {
            category.push($(this).val());
        });
        this.data.plan_categories = category;
        this.checkedCategory = category;
        //create plan
        if (this.app.uploadImagePlans.length == 0) {
            if ($('.image').length > 0) {
                if ($('input#image-1').is(':visible') == true) {
                    if ($('input#image-1')[0].files[0]) {
                        this.data['image-1'] = this.upload.getDataFile('image-1');
                    } else {
                        this.data['image-1'] = 0;
                    }
                } else {
                    delete this.data['image-1'];
                }
                if ($('input#image-2').is(':visible') == true) {
                    if ($('input#image-2')[0].files[0]) {
                        this.data['image-2'] = this.upload.getDataFile('image-2');
                    } else {
                        this.data['image-2'] = 0;
                    }
                } else {
                    delete this.data['image-2'];
                }
                if ($('input#image-3').is(':visible') == true) {
                    if ($('input#image-3')[0].files[0]) {
                        this.data['image-3'] = this.upload.getDataFile('image-3');
                    } else {
                        this.data['image-3'] = 0;
                    }
                } else {
                    delete this.data['image-3'];
                }
                if ($('input#image-4').is(':visible') == true) {
                    if ($('input#image-4')[0].files[0]) {
                        this.data['image-4'] = this.upload.getDataFile('image-4');
                    } else {
                        this.data['image-4'] = 0;
                    }
                } else {
                    delete this.data['image-4'];
                }
                if ($('input#image-5').is(':visible') == true) {
                    if ($('input#image-5')[0].files[0]) {
                        this.data['image-5'] = this.upload.getDataFile('image-5');
                    } else {
                        this.data['image-5'] = 0;
                    }
                } else {
                    delete this.data['image-5'];
                }
                if ($('input#image-6').is(':visible') == true) {
                    if ($('input#image-6')[0].files[0]) {
                        this.data['image-6'] = this.upload.getDataFile('image-6');
                    } else {
                        this.data['image-6'] = 0;
                    }
                } else {
                    delete this.data['image-6'];
                }
                if ($('input#image-7').is(':visible') == true) {
                    if ($('input#image-7')[0].files[0]) {
                        this.data['image-7'] = this.upload.getDataFile('image-7');
                    } else {
                        this.data['image-7'] = 0;
                    }
                } else {
                    delete this.data['image-7'];
                }
                if ($('input#image-8').is(':visible') == true) {
                    if ($('input#image-8')[0].files[0]) {
                        this.data['image-8'] = this.upload.getDataFile('image-8');
                    } else {
                        this.data['image-8'] = 0;
                    }
                } else {
                    delete this.data['image-8'];
                }
                if ($('input#image-9').is(':visible') == true) {
                    if ($('input#image-9')[0].files[0]) {
                        this.data['image-9'] = this.upload.getDataFile('image-9');
                    } else {
                        this.data['image-9'] = 0;
                    }
                } else {
                    delete this.data['image-9'];
                }
                if ($('input#image-10').is(':visible') == true) {
                    if ($('input#image-10')[0].files[0]) {
                        this.data['image-10'] = this.upload.getDataFile('image-10');
                    } else {
                        this.data['image-10'] = 0;
                    }
                } else {
                    delete this.data['image-10'];
                }

            } else {
                for (let i = 1; i <= 10; i++) {
                    delete this.data['image-' + i];
                }
                delete this.data.images;
            }
        } else {
            for (let i = 0; i < this.app.uploadImagePlans.length; i++) {
                this.data['image-' + (i + 1)] = this.app.uploadImagePlans[i];
            }
            if ($('.image').length > 0) {
                if ($('input#image-10').is(':visible') == true) {
                    if ($('input#image-10')[0].files[0]) {
                        this.data['image-10'] = this.upload.getDataFile('image-10');
                    } else {
                        this.data['image-10'] = 0;
                    }
                } else {
                    if (!this.data['image-10']) {
                        delete this.data['image-10'];
                    }
                }
                if ($('input#image-9').is(':visible') == true) {
                    if ($('input#image-9')[0].files[0]) {
                        this.data['image-9'] = this.upload.getDataFile('image-9');
                    } else {
                        this.data['image-9'] = 0;
                    }
                } else {
                    if (!this.data['image-9']) {
                        delete this.data['image-9'];
                    }
                }
                if ($('input#image-8').is(':visible') == true) {
                    if ($('input#image-8')[0].files[0]) {
                        this.data['image-8'] = this.upload.getDataFile('image-8');
                    } else {
                        this.data['image-8'] = 0;
                    }
                } else {
                    if (!this.data['image-8']) {
                        delete this.data['image-8'];
                    }
                }
                if ($('input#image-7').is(':visible') == true) {
                    if ($('input#image-7')[0].files[0]) {
                        this.data['image-7'] = this.upload.getDataFile('image-7');
                    } else {
                        this.data['image-7'] = 0;
                    }
                } else {
                    if (!this.data['image-7']) {
                        delete this.data['image-7'];
                    }
                }
                if ($('input#image-6').is(':visible') == true) {
                    if ($('input#image-6')[0].files[0]) {
                        this.data['image-6'] = this.upload.getDataFile('image-6');
                    } else {
                        this.data['image-6'] = 0;
                    }
                } else {
                    if (!this.data['image-6']) {
                        delete this.data['image-6'];
                    }
                }
                if ($('input#image-5').is(':visible') == true) {
                    if ($('input#image-5')[0].files[0]) {
                        this.data['image-5'] = this.upload.getDataFile('image-5');
                    } else {
                        this.data['image-5'] = 0;
                    }
                } else {
                    if (!this.data['image-5']) {
                        delete this.data['image-5'];
                    }
                }
                if ($('input#image-4').is(':visible') == true) {
                    if ($('input#image-4')[0].files[0]) {
                        this.data['image-4'] = this.upload.getDataFile('image-4');
                    } else {
                        this.data['image-4'] = 0;
                    }
                } else {
                    if (!this.data['image-4']) {
                        delete this.data['image-4'];
                    }
                }
                if ($('input#image-3').is(':visible') == true) {
                    if ($('input#image-3')[0].files[0]) {
                        this.data['image-3'] = this.upload.getDataFile('image-3');
                    } else {
                        this.data['image-3'] = 0;
                    }
                } else {
                    if (!this.data['image-3']) {
                        delete this.data['image-3'];
                    }
                }
                if ($('input#image-2').is(':visible') == true) {
                    if ($('input#image-2')[0].files[0]) {
                        this.data['image-2'] = this.upload.getDataFile('image-2');
                    } else {
                        this.data['image-2'] = 0;
                    }
                } else {
                    if (!this.data['image-2']) {
                        delete this.data['image-2'];
                    }
                }
                if ($('input#image-1').is(':visible') == true) {
                    if ($('input#image-1')[0].files[0]) {
                        this.data['image-1'] = this.upload.getDataFile('image-1');
                    } else {
                        this.data['image-1'] = 0;
                    }
                } else {
                    if (!this.data['image-1']) {
                        delete this.data['image-1'];
                    }
                }
                this.data.images = 1;
            } else {
                for (let i = 10; i > this.app.uploadImagePlans.length; i--) {
                    delete this.data['image-' + i];
                }
            }

        }


        this.app.post('mypage/plan/add', this.data).then(res => {
            if (res.status == 200) {
                this.app.setConfig('confirmCreatePlan', JSON.stringify({
                    formPlan: this.data,
                    planHourMin: this.timeStart,
                    categories: category,
                    listCategory: this.listCategory,
                    listLanguage: this.listlanguage,
                    multiplelanguage: this.Languages,
                    prefectureText: $("#plan-prefecture option:selected").text().trim(),
                    time_request_hour: $('#time_request_hour').val(),
                    time_request_min: $('#time_request_min').val(),
                    languagePlan: this.listLanguage[this.data.plan_language_id],
                    id_active: $('.active').attr('id'),
                    country_name:$('.plan-contory :selected').text().trim()

                }));
                this.app.uploadImagePlans = [];
                if (this.data['image-1']) {
                    this.app.uploadImagePlans.push(this.data['image-1']);
                }
                if (this.data['image-2']) {
                    this.app.uploadImagePlans.push(this.data['image-2']);
                }
                if (this.data['image-3']) {
                    this.app.uploadImagePlans.push(this.data['image-3']);
                }
                if (this.data['image-4']) {
                    this.app.uploadImagePlans.push(this.data['image-4']);
                }
                if (this.data['image-5']) {
                    this.app.uploadImagePlans.push(this.data['image-5']);
                }
                if (this.data['image-6']) {
                    this.app.uploadImagePlans.push(this.data['image-6']);
                }
                if (this.data['image-7']) {
                    this.app.uploadImagePlans.push(this.data['image-7']);
                }
                if (this.data['image-8']) {
                    this.app.uploadImagePlans.push(this.data['image-8']);
                }
                if (this.data['image-9']) {
                    this.app.uploadImagePlans.push(this.data['image-9']);
                }
                if (this.data['image-10']) {
                    this.app.uploadImagePlans.push(this.data['image-10']);
                }
                this.backtoCreate = false;
                this.router.navigate([this.languageName + '/mypage/plan/confirmation']);
            } else {
                window.scroll(0, 400);
                this.Error = res.json();
                this.timeStartError = [];
                for (let i = 0; i < $('.plan-time-start').length; i++) {
                    this.timeStartError.push(res.json()['plan_time_start.' + i + '.time_start']);
                }
                this.languageError = [];
                for (let i = 0; i < $('.language_id').length; i++) {
                    this.languageError.push(res.json()['plan_languages.' + i + '.language_id']);
                }

                this.imageError = [];
                for (let i = 1; i <= $('.image').length; i++) {
                    this.imageError.push(res.json()['image-' + i]);
                }

                this.imageBackError = [];
                for (let i = 10; i >= $('.image').length; i--) {
                    this.imageBackError.push(res.json()['image-' + i]);
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

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - Making the travel plan - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('My page -  the creating screen for a travel plan. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')
            }
        ]);
    }

    deleteImageFromConfirm(key, name) {
        this.app.uploadImagePlans.splice(key, 1);
        $('.delete-image-'+key).remove();
        if($('.block-image').length == 0){
            this.addImage();
        }

    }

    getListCountry(language_plan_id){
        this.app.get('countries/list_by_language',{'language_id':language_plan_id}).then(res=>{
            if(res.status == 200){
                this.listCountry = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    changeCountry(){
        let country_id = $('.plan-contory').val();
        let key = $('.active').val();
        this.app.get('cities/list_by_country', {'language_id': key, 'country_id': country_id}).then(res => {
            if (res.status == 200) {
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }


}

