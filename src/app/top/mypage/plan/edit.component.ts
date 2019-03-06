import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
import {split} from "ts-node/dist";
import {UploadService} from "../../../shared/upload/upload.service";


@Component({
    selector: 'mypage-plan-edit',
    templateUrl: './edit.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './edit.component.css'
    ]
})
export class EditComponent implements OnInit {
    private data = {};

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router,
                private upload: UploadService) {
    }

    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.language;
    private curMember = this.app.getCurrentMember();
    private prefecture;
    private plan_id;
    private listLanguage;
    private listCountry;
    private country_select;
    private listPrefecture;
    private listlanguage;
    private listCategory;
    private checkedCategory;
    private selectedPrefecture;
    private checkedTimeApply = 1;
    private confirmback = false;
    private editData = {
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
        'price': '',
        'start_time': '',
        'language_id': this.app.getConfig('TOP_LANG_ID') ? this.app.getConfig('TOP_LANG_ID') : '',
        'plan_language_id': this.app.getConfig('Plan_Language') ? this.app.getConfig('Plan_Language'):'',
        'plan_content': '',
        'other': '',
        'participation_case': '',
        'plan_languages': [],
        'plan_time_start': [],
        'plan_categories': [],
        'non_changed_ids': [],
    };
    private addressMap = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=Tokyo,Japan&zoom=16&maptype=roadmap&language=ja&region=JP";
    private Languages = {'language': [{'id': '', 'language_id': '', 'display_name': '', 'name': ''}]};
    private timeStart = {'time': [{'plan_hour': '00', 'plan_min': '00'}]};
    private images = {'plan_images': [{'image': ''}]};
    private Error = [];
    private timeStartError = [];
    private languageError = [];
    private imageEdit = [];
    private plan_images = [];
    private plan_images_back = [];
    private plan_confirm_backs = [];
    private showImageFromConfirm = [];
    private imageError = [];
    private imageBackError = [];
    private confirmFormData;
    private addPlan = false;
    private selectedCountry = false;
    private plan_language: any;
    private language_add = [];

    ngOnInit() {
        this.app.checkAuthGuider();
        window.scroll(0, 0);
        this.app.checkDisplayLanguage(this.languageName);
        this.setTitleAndDescription();
        if (this.app.getConfig('Plan_Language')) {
            this.plan_language = parseInt(this.app.getConfig('Plan_Language'));
        } else {
            // this.plan_language = this.language_id;
        }
        this.getListCityByCountry();
        this.getListLanguage();
        this.getListLanguageContent();
        if (this.app.getConfig('confirmEditPlan') && this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.addPlan = false;
            this.confirmback = true;
            this.getCategoryDefault();
            this.confirmFormData = JSON.parse(this.app.getConfig('confirmEditPlan'));
            this.data = this.confirmFormData.formPlan;
            this.Languages.language = this.confirmFormData.multiplelanguage.language;
            this.timeStart.time = this.confirmFormData.planHourMin.time;
            this.plan_id = this.confirmFormData.formPlan['id'];
            this.plan_language = this.confirmFormData.formPlan.plan_language_id;
            $('#plan-meal').val(this.confirmFormData.formPlan.meal);
            $('#content').val(this.confirmFormData.formPlan.content);
            $('#guide_perparation').val(this.confirmFormData.formPlan.guide_perparation);
            $('#guest_perparation').val(this.confirmFormData.formPlan.guest_perparation);
            $('#plan-address').val(this.confirmFormData.formPlan.address_meeting);
            $('#plan-name').val(this.confirmFormData.formPlan.proposal_title);
            if (this.language_id == this.app.constant.TRUE) {
                $('.title-plan-edit').text(this.confirmFormData.formPlan.proposal_title + ' ' + this.app.ttrans('修正'));
            } else {
                $('.title-plan-edit').text(this.app.ttrans('The modification of the travel plan'));
            }
            $('#time_request_hour').val(this.confirmFormData.time_request_hour);
            $('#time_request_min').val(this.confirmFormData.time_request_min);
            $('#min_number').val(this.confirmFormData.formPlan.min_people);
            $('#max_number').val(this.confirmFormData.formPlan.max_people);
            $('#plan-price').val(this.confirmFormData.formPlan.price);
            // $('#language_plan').val(this.confirmFormData.formPlan.language_id);
            $('#plan-term').val(this.confirmFormData.formPlan.num_before_deadline);
            $('#other').val(this.confirmFormData.formPlan.other);
            $('#participation_case').val(this.confirmFormData.formPlan.participation_case);
            this.plan_confirm_backs = this.confirmFormData.plan_confirm_backs;
            this.country_select = this.confirmFormData.formPlan.country_id;
            if(parseInt(this.confirmFormData.formPlan.country_id) == parseInt(this.app.constant.COUNTRY_DEFAULT)){
                if (parseInt(this.confirmFormData.formPlan.plan_language_id) == this.app.constant.TRUE) {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.confirmFormData.formPlan.address_meeting +','+ this.confirmFormData.prefectureText + ','+ this.confirmFormData.country_name +'Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
                } else {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.confirmFormData.formPlan.address_meeting +','+ this.confirmFormData.prefectureText + ','+ this.confirmFormData.country_name +'Japan&zoom=16&maptype=roadmap&language=en&&region=JP';
                }
            }else {
                if (parseInt(this.confirmFormData.formPlan.plan_language_id) == this.app.constant.TRUE) {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.confirmFormData.formPlan.address_meeting +','+ this.confirmFormData.prefectureText + ','+ this.confirmFormData.country_name +'&zoom=16&maptype=roadmap&language=ja';
                } else {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.confirmFormData.formPlan.address_meeting +','+ this.confirmFormData.prefectureText + ','+ this.confirmFormData.country_name +'&zoom=16&maptype=roadmap&language=en';
                }
            }

            if (this.confirmFormData.formPlan.plan_language_id == this.app.constant.TRUE) {
                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.confirmFormData.formPlan.address_meeting + this.confirmFormData.prefectureText + this.confirmFormData.country_name +'&zoom=16&maptype=roadmap&language=ja';
            } else {
                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.confirmFormData.formPlan.address_meeting + this.confirmFormData.prefectureText +this.confirmFormData.country_name+ '&zoom=16&maptype=roadmap&language=en';
            }


            this.selectedPrefecture = parseInt(this.confirmFormData.formPlan.city_id);
            this.checkedTimeApply = parseInt(this.confirmFormData.formPlan.time_apply);
            this.selectedCountry = true;
            this.checkedCategory = this.confirmFormData.categories;

            if (this.app.image_edit_plans.length > 0) {
                for (let i = 1; i <= 10; i++) {
                    delete this.data['image-' + i];
                }
                let image_back_to_confirm = [];
                let dataUpload = this.app.image_edit_plans;
                for (let i = 0; i < dataUpload.length; i++) {
                    this.getImageSource('image-' + (i + 1), dataUpload[i], function (data) {
                        image_back_to_confirm.push({key: i, name: dataUpload[i].name, src: data});
                    });
                }
                this.showImageFromConfirm = image_back_to_confirm;
            }

            if (this.confirmFormData.imageDetail) {
                this.plan_images_back = this.confirmFormData.imageDetail;
                this.plan_images = [];
            }

            this.language_add = this.confirmFormData.language_add;

            this.app.get('categories/get_categories_by_language', {language_id: this.plan_language}).then(res => {
                if (res.status == 200) {
                    this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
                }
            });
            this.app.get('cities/list_by_country', {
                'language_id': this.plan_language,
                'country_id': this.confirmFormData.formPlan.country_id
            }).then(res => {
                if (res.status == 200) {
                    this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                }
            });

            this.getListCountry(this.confirmFormData.formPlan.plan_language_id);
        } else if(this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.confirmback = false;
            this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.plan_id = params['id'];
                    this.app.get('mypage/plan/detail', {
                        plan_id: params['id'],
                        member_id: this.curMember.id,
                        language_id: this.plan_language
                    }).then(res => {
                        if (res.status == 200) {
                            this.getListCountry(this.plan_language);
                            this.data = res.json().data;
                            this.plan_images = res.json().data.images;
                            this.country_select = res.json().data.country_id;

                            this.language_add = this.app.pushToArr(res.json().data.plan_translates, 'id', 'display_name');
                            this.plan_images_back = [];
                            this.editData.id = params['id'];

                            this.app.get('cities/list_by_country', {'language_id': this.plan_language, 'country_id': this.country_select}).then(res => {
                                if (res.status == 200) {
                                    this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                                    let city_id = this.data['city_id'];
                                    let city_name = '';
                                    if(this.listPrefecture){
                                        $.each(this.listPrefecture,function (key,value) {
                                            if(parseInt(city_id) == parseInt(key)){
                                                city_name = value;
                                            }
                                        });
                                        this.prefecture = city_name;
                                    }
                                    let country = '';
                                    let country_id = this.country_select;
                                    if(this.listCountry){
                                        $.each(this.listCountry,function (key,value) {
                                            if(parseInt(country_id) == parseInt(key)){
                                                country = value;
                                            }
                                        });
                                    }
                                    if (this.plan_language == this.app.constant.TRUE) {
                                        if(country == this.app.constant.COUNTRY_DEFAULT){
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + 'Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
                                        }else {
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + country+ '&zoom=16&maptype=roadmap&language=ja';
                                        }
                                    } else {
                                        if(country == this.app.constant.COUNTRY_DEFAULT){
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + 'Japan&zoom=16&maptype=roadmap&language=en&region=JP';
                                        }else {
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + country+ '&zoom=16&maptype=roadmap&language=en';
                                        }
                                    }
                                }
                            });

                            $('#plan-name').val(res.json().data.proposal_title);
                            if (this.language_id == this.app.constant.TRUE) {
                                $('.title-plan-edit').text(res.json().data.proposal_title + this.app.ttrans('修正'));
                            } else {
                                $('.title-plan-edit').text(this.app.ttrans('The modification of the travel plan'));
                            }
                            $('#plan-meal').val(res.json().data.meal);
                            $('#content').val(res.json().data.content);
                            $('#guide_perparation').val(res.json().data.guide_perparation);
                            $('#guest_perparation').val(res.json().data.guest_perparation);
                            $('#participation_case').val(res.json().data.participation_case);
                            $('#other').val(res.json().data.other);
                            $('#plan-address').val(res.json().data.address_meeting);
                            var timeRequest = res.json().data.time_request.split(':');
                            $('#time_request_hour').val(timeRequest[0]);
                            $('#time_request_min').val(timeRequest[1]);
                            $('#min_number').val(res.json().data.min_people);
                            $('#max_number').val(res.json().data.max_people);
                            $('#plan-price').val(res.json().data.price);
                            $('#plan-term').val(res.json().data.num_before_deadline);
                            this.selectedPrefecture = parseInt(res.json().data.city_id);
                            this.checkedTimeApply = parseInt(res.json().data.time_apply);

                            this.Languages.language = res.json().data.languages;
                            var minHour;
                            var planHourMin = [];
                            $.each(res.json().data.time_start, function (index, value) {
                                minHour = value.split(':');
                                planHourMin.push({plan_hour: minHour[0], plan_min: minHour[1]})
                            });
                            this.timeStart.time = planHourMin;

                            var checkedCate = [];
                            $.each(res.json().data.categories, function (index, value) {
                                checkedCate.push(value.id);
                            });
                            this.checkedCategory = checkedCate;

                            this.app.get('categories/get_categories_by_language', {language_id: this.plan_language}).then(res => {
                                if (res.status == 200) {
                                    this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
                                }
                            });
                            if(res.json().data.proposal_title == null){
                                this.addPlan = true;
                                // this.addImage();
                            }else {
                                this.addPlan = false;
                            }
                        } else {
                            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                            this.router.navigate([this.languageName]);
                        }
                    });
                }
            });
        }


    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - modify the the travel plan - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('My page - the modification screen for the travel plan. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')
            }
        ]);
    }


    getCategoryDefault() {
        this.app.get('categories/get_categories_by_language', {language_id: this.language_id}).then(res => {
            if (res.status == 200) {
                this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');

            }
        });
    }

    getListCityByCountry() {
        this.app.get('cities/list_by_country', {'language_id': this.language_id, 'country_id': 1}).then(res => {
            if (res.status == 200) {
                this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    getListLanguage() {
        this.app.get('languages', {'active': 1, 'is_support': this.app.constant.TRUE}).then(res => {
            if (res.status == 200) {
                this.listlanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }

    addLanguage() {
        this.Languages.language.push({'id': '', 'language_id': '', 'display_name': '', 'name': ''});
    }

    removeLanguage(index = 0) {
        this.Languages.language.splice(index, 1);
    }

    addTime() {
        this.timeStart.time.push({'plan_hour': '00', 'plan_min': '00'});
    }

    removeTime(index = 0) {
        this.timeStart.time.splice(index, 1);
    }

    addImage() {

        if (this.app.image_edit_plans.length > 0 && this.confirmback == true) {
            if ($('input#image-10').is(':hidden') == true || $('input#image-1').is(':hidden') == true) {
                $('.upload-image-back-from-confirm').css("display", "block");
            } else {
                if (($('.image').length + $('.image-default').length ) < 10) {
                    this.images.plan_images.push({'image': ''});
                }
            }
        }
        if (this.app.image_edit_plans.length == 0 && this.confirmback == true) {
            if ($('input#image-10').is(':hidden') == true || $('input#image-1').is(':hidden') == true) {
                $('.upload-image-back-from-confirm').css("display", "block");
            } else {
                if (($('.image').length + $('.image-default').length ) < 10) {
                    this.images.plan_images.push({'image': ''});
                }
            }
        }
        if (this.confirmback == false) {
            if ($('input#image-10').is(':hidden') == true || $('input#image-1').is(':hidden') == true) {
                $('.upload-image-back-from-confirm').css("display", "block");
            } else {
                if (($('.image').length + $('.detail-img').length ) < 10) {
                    this.images.plan_images.push({'image': ''});
                }
            }
        }

    }

    addImagePlan() {
        if (($('.image').length + $('.image-default').length ) < 10) {
            this.images.plan_images.push({'image': ''});
        }
    }

    removeImage(index = 0) {
        if ($('.image').length >= 1 && $('.image-default').length >= 1) {
            this.images.plan_images.splice(index, 1);
        }
        if ($('.image').length > 1 && $('.image-default').length == 0) {
            this.images.plan_images.splice(index, 1);
        }
        if ($('.image').length == 0 && $('.image-default').length > 1) {
            this.images.plan_images.splice(index, 1);
        }
    }

    deleteImage(idImage) {
        $('.image-' + idImage).remove();
        if ($('.image-default').length == 0 && $('.image').length == 1 && $('input#image-1').is(':hidden') == true) {
            // this.addImage();
            $('.upload-image-back-from-confirm').css("display", "block");
        }
        if ($('.edit-back-image-plan-' + idImage).length == 0) {
            this.plan_images_back = [];
        }
    }

    deleteImageBack(idImage) {
        $('.edit-back-image-plan-' + idImage).remove();
        if ($('.edit-back-image-plan-' + idImage).length == 0) {
            this.plan_images_back = [];
        }
        if (this.app.image_edit_plans.length == 0 && this.confirmback == true && $('.image-default').length == 0 && $('.image').length == 1 && $('input#image-10').is(':hidden') == true) {
            $('.upload-image-back-from-confirm').css("display", "block");
        }
    }


    changeMap() {
        if ($("#plan-contory option:selected").val() != '') {
            let key = $('.active').val();
            let country = $("#plan-contory option:selected").text();
            let prefecture = $("#plan-prefecture option:selected").text();
            let address = $('#plan-address').val();
            let location = address + ',' + prefecture + ',' + country;
            if(parseInt($("#plan-contory option:selected").val()) == this.app.constant.COUNTRY_DEFAULT ) {
                if (key == this.app.constant.TRUE) {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + location + 'Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
                } else {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + location + 'Japan&zoom=16&maptype=roadmap&language=en&region=JP';
                }
            }else {
                if (key == this.app.constant.TRUE) {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + location + '&zoom=16&maptype=roadmap&language=ja';
                } else {
                    this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + location + '&zoom=16&maptype=roadmap&language=en';
                }
            }

        }
    }

    confirmSave() {
        this.editData.id = this.plan_id;
        // this.editData.language_id = this.language_id;
        this.editData.meal = $('#plan-meal').val();
        this.editData.content = $('#content').val();
        this.editData.guide_perparation = $('#guide_perparation').val();
        this.editData.guest_perparation = $('#guest_perparation').val();
        this.editData.other = $('#other').val();
        this.editData.participation_case = $('#participation_case').val();
        this.editData.address_meeting = $('#plan-address').val();
        this.editData.proposal_title = $('#plan-name').val();
        this.editData.time_request = $('#time_request_hour').val() + ":" + $('#time_request_min').val();
        this.editData.min_people = $('#min_number').val();
        this.editData.max_people = $('#max_number').val();
        this.editData.num_before_deadline = $('#plan-term').val();
        this.editData.country_id = $('#plan-contory').val();
        this.editData.city_id = $('#plan-prefecture').val();
        this.editData.plan_language_id = this.plan_language;
        this.editData.price = $('#plan-price').val();
        if ($('#plan-limit-01').is(':checked') == true) {
            this.editData.time_apply = this.app.constant.Guider.time_apply.TIME_REQUIRED;
        }
        if ($('#plan-limit-02').is(':checked') == true) {
            this.editData.time_apply = this.app.constant.Guider.time_apply.RESERVE_TIME;
        }
        if ($('#plan-limit-03').is(':checked') == true) {
            this.editData.time_apply = this.app.constant.Guider.time_apply.DAILY_RESERVATION;
        }
        //time_start
        if (this.timeStart.time) {
            var time_start = [];
            $.each(this.timeStart.time, function (index, value) {
                time_start.push({'time_start': value.plan_hour + ':' + value.plan_min});
            });
            this.editData.plan_time_start = time_start;
        }
        //languages support
        if (this.Languages.language) {
            var languages = [];
            $.each(this.Languages.language, function (index, value) {
                languages.push({'language_id': value.language_id});
            });
            this.editData.plan_languages = languages;
        }
        //categories
        let category = [];
        if (this.checkedCategory != []) {
            $.each(this.checkedCategory, function (index, value) {
                category.push(value);
            });
        }
        var plan_categories = [];
        $('.checkbox:checkbox:checked').each(function () {
            plan_categories.push($(this).val());
        });
        this.editData.plan_categories = plan_categories;

        if (this.app.image_edit_plans.length == 0) {
            if ($('.image').length > 0) {

                if ($('input#image-1').is(':visible') == true) {
                    if ($('input#image-1')[0].files[0]) {
                        this.editData['image-1'] = this.upload.getDataFile('image-1');
                    } else if ($('input#image-1')[1].files[0]) {
                        this.editData['image-1'] = this.upload.getDataFile('image-1');
                    } else {
                        this.editData['image-1'] = 0;
                    }
                } else {
                    delete this.editData['image-1'];
                }
                if ($('input#image-2').is(':visible') == true) {
                    if ($('input#image-2')[0].files[0]) {
                        this.editData['image-2'] = this.upload.getDataFile('image-2');
                    } else if ($('input#image-2')[1].files[0]) {
                        this.editData['image-2'] = this.upload.getDataFile('image-2');
                    } else {
                        this.editData['image-2'] = 0;
                    }
                } else {
                    delete this.editData['image-2'];
                }
                if ($('input#image-3').is(':visible') == true) {
                    if ($('input#image-3')[0].files[0]) {
                        this.editData['image-3'] = this.upload.getDataFile('image-3');
                    } else if ($('input#image-3')[1].files[0]) {
                        this.editData['image-3'] = this.upload.getDataFile('image-3');
                    } else {
                        this.editData['image-3'] = 0;
                    }
                } else {
                    delete this.editData['image-3'];
                }
                if ($('input#image-4').is(':visible') == true) {
                    if ($('input#image-4')[0].files[0]) {
                        this.editData['image-4'] = this.upload.getDataFile('image-4');
                    } else if ($('input#image-4')[1].files[0]) {
                        this.editData['image-4'] = this.upload.getDataFile('image-4');
                    } else {
                        this.editData['image-4'] = 0;
                    }
                } else {
                    delete this.editData['image-4'];
                }
                if ($('input#image-5').is(':visible') == true) {
                    if ($('input#image-5')[0].files[0]) {
                        this.editData['image-5'] = this.upload.getDataFile('image-5');
                    } else if ($('input#image-5')[1].files[0]) {
                        this.editData['image-5'] = this.upload.getDataFile('image-5');
                    } else {
                        this.editData['image-5'] = 0;
                    }
                } else {
                    delete this.editData['image-5'];
                }
                if ($('input#image-6').is(':visible') == true) {
                    if ($('input#image-6')[0].files[0]) {
                        this.editData['image-6'] = this.upload.getDataFile('image-6');
                    } else if ($('input#image-6')[1].files[0]) {
                        this.editData['image-6'] = this.upload.getDataFile('image-6');
                    } else {
                        this.editData['image-6'] = 0;
                    }
                } else {
                    delete this.editData['image-6'];
                }
                if ($('input#image-7').is(':visible') == true) {
                    if ($('input#image-7')[0].files[0]) {
                        this.editData['image-7'] = this.upload.getDataFile('image-7');
                    } else if ($('input#image-7')[1].files[0]) {
                        this.editData['image-7'] = this.upload.getDataFile('image-7');
                    } else {
                        this.editData['image-7'] = 0;
                    }
                } else {
                    delete this.editData['image-7'];
                }
                if ($('input#image-8').is(':visible') == true) {
                    if ($('input#image-8')[0].files[0]) {
                        this.editData['image-8'] = this.upload.getDataFile('image-8');
                    } else if ($('input#image-8')[1].files[0]) {
                        this.editData['image-8'] = this.upload.getDataFile('image-8');
                    } else {
                        this.editData['image-8'] = 0;
                    }
                } else {
                    delete this.editData['image-8'];
                }
                if ($('input#image-9').is(':visible') == true) {
                    if ($('input#image-9')[0].files[0]) {
                        this.editData['image-9'] = this.upload.getDataFile('image-9');
                    } else if ($('input#image-9')[1].files[0]) {
                        this.editData['image-9'] = this.upload.getDataFile('image-9');
                    } else {
                        this.editData['image-9'] = 0;
                    }
                } else {
                    delete this.editData['image-9'];
                }
                if ($('input#image-10').is(':visible') == true) {
                    if ($('input#image-10')[0].files[0]) {
                        this.editData['image-10'] = this.upload.getDataFile('image-10');
                    }
                    else if ($('input#image-10')[1].files[0]) {
                        this.editData['image-10'] = this.upload.getDataFile('image-10');
                    } else {
                        this.editData['image-10'] = 0;
                    }
                } else {
                    delete this.editData['image-10'];
                }


            } else {
                for (let i = 1; i <= 10; i++) {
                    if (!this.editData['image-' + i] || this.editData['image-' + i] == 0) {
                        delete this.editData['image-' + i];
                    }
                }
            }
        } else {
            for (let i = 0; i < this.app.image_edit_plans.length; i++) {
                this.editData['image-' + (i + 1)] = this.app.image_edit_plans[i];
            }
            if ($('.image').length > 0) {
                if ($('input#image-10').is(':visible') == true) {
                    if ($('input#image-10')[0].files[0]) {
                        this.editData['image-10'] = this.upload.getDataFile('image-10');
                    } else {
                        this.editData['image-10'] = 0;
                    }
                } else {
                    if (!this.editData['image-10']) {
                        delete this.editData['image-10'];
                    }
                }
                if ($('input#image-9').is(':visible') == true) {
                    if ($('input#image-9')[0].files[0]) {
                        this.editData['image-9'] = this.upload.getDataFile('image-9');
                    } else {
                        this.editData['image-9'] = 0;
                    }
                } else {
                    if (!this.editData['image-9']) {
                        delete this.editData['image-9'];
                    }
                }
                if ($('input#image-8').is(':visible') == true) {
                    if ($('input#image-8')[0].files[0]) {
                        this.editData['image-8'] = this.upload.getDataFile('image-8');
                    } else {
                        this.editData['image-8'] = 0;
                    }
                } else {
                    if (!this.editData['image-8']) {
                        delete this.editData['image-8'];
                    }
                }
                if ($('input#image-7').is(':visible') == true) {
                    if ($('input#image-7')[0].files[0]) {
                        this.editData['image-7'] = this.upload.getDataFile('image-7');
                    } else {
                        this.editData['image-7'] = 0;
                    }
                } else {
                    if (!this.editData['image-7']) {
                        delete this.editData['image-7'];
                    }
                }
                if ($('input#image-6').is(':visible') == true) {
                    if ($('input#image-6')[0].files[0]) {
                        this.editData['image-6'] = this.upload.getDataFile('image-6');
                    } else {
                        this.editData['image-6'] = 0;
                    }
                } else {
                    if (!this.editData['image-6']) {
                        delete this.editData['image-6'];
                    }
                }
                if ($('input#image-5').is(':visible') == true) {
                    if ($('input#image-5')[0].files[0]) {
                        this.editData['image-5'] = this.upload.getDataFile('image-5');
                    } else {
                        this.editData['image-5'] = 0;
                    }
                } else {
                    if (!this.editData['image-5']) {
                        delete this.editData['image-5'];
                    }
                }
                if ($('input#image-4').is(':visible') == true) {
                    if ($('input#image-4')[0].files[0]) {
                        this.editData['image-4'] = this.upload.getDataFile('image-4');
                    } else {
                        this.editData['image-4'] = 0;
                    }
                } else {
                    if (!this.editData['image-4']) {
                        delete this.editData['image-4'];
                    }
                }
                if ($('input#image-3').is(':visible') == true) {
                    if ($('input#image-3')[0].files[0]) {
                        this.editData['image-3'] = this.upload.getDataFile('image-3');
                    } else {
                        this.editData['image-3'] = 0;
                    }
                } else {
                    if (!this.editData['image-3']) {
                        delete this.editData['image-3'];
                    }
                }
                if ($('input#image-2').is(':visible') == true) {
                    if ($('input#image-2')[0].files[0]) {
                        this.editData['image-2'] = this.upload.getDataFile('image-2');
                    } else {
                        this.editData['image-2'] = 0;
                    }
                } else {
                    if (!this.editData['image-2']) {
                        delete this.editData['image-2'];
                    }
                }
                if ($('input#image-1').is(':visible') == true) {
                    if ($('input#image-1')[0].files[0]) {
                        this.editData['image-1'] = this.upload.getDataFile('image-1');
                    } else {
                        this.editData['image-1'] = 0;
                    }
                } else {
                    if (!this.editData['image-1']) {
                        delete this.editData['image-1'];
                    }
                }
                // this.data.images = 1;
            } else {
                for (let i = 10; i > this.app.image_edit_plans.length; i--) {
                    delete this.editData['image-' + i];
                }
            }

        }


        // xu ly image
        if (this.plan_images) {
            let hasImg = [];
            let imgDetail = [];
            $.each($('.detail-img'), function (index, value) {
                hasImg.push($('.detail-img')[index].id);
                imgDetail.push({id: $('.detail-img')[index].id, image: $('.detail-img')[index].currentSrc});
            });
            this.editData.non_changed_ids = hasImg;
            this.plan_confirm_backs = imgDetail;
        }
        if (this.editData.non_changed_ids.length > 0) {
            this.editData['images'] = 1;
        }
        for (let i = 1; i <= 10; i++) {
            if (this.editData['image-' + i] != 0) {
                this.editData['images'] = 1;
            }
        }
        // if(this.editData.non_changed_ids.length == 0){
        //   delete  this.editData['images'];
        // }else {
        //     this.editData['images'] = 1;
        // }
        // if(this.editData['image-1']){
        //     this.editData['images'] = 1;
        // }
        this.app.post('mypage/plan/add', this.editData).then(res => {
            if (res.status == 200) {
                this.app.setConfig('confirmEditPlan', JSON.stringify({
                    formPlan: this.editData,
                    planHourMin: this.timeStart,
                    categories: plan_categories,
                    listCategory: this.listCategory,
                    listLanguage: this.listlanguage,
                    multiplelanguage: this.Languages,
                    prefectureText: $("#plan-prefecture option:selected").text(),
                    countryText: $("#plan-contory option:selected").text(),
                    // plan_confirm_backs:this.plan_confirm_backs,
                    imageDetail: this.plan_confirm_backs,
                    time_request_hour: $('#time_request_hour').val(),
                    time_request_min: $('#time_request_min').val(),
                    languagePlan: this.listLanguage[this.editData.plan_language_id],
                    language_add: this.language_add,

                }));
                this.app.image_edit_plans = [];
                if (this.editData['image-1']) {
                    this.app.image_edit_plans.push(this.editData['image-1']);
                }
                if (this.editData['image-2']) {
                    this.app.image_edit_plans.push(this.editData['image-2']);
                }
                if (this.editData['image-3']) {
                    this.app.image_edit_plans.push(this.editData['image-3']);
                }
                if (this.editData['image-4']) {
                    this.app.image_edit_plans.push(this.editData['image-4']);
                }
                if (this.editData['image-5']) {
                    this.app.image_edit_plans.push(this.editData['image-5']);
                }
                if (this.editData['image-6']) {
                    this.app.image_edit_plans.push(this.editData['image-6']);
                }
                if (this.editData['image-7']) {
                    this.app.image_edit_plans.push(this.editData['image-7']);
                }
                if (this.editData['image-8']) {
                    this.app.image_edit_plans.push(this.editData['image-8']);
                }
                if (this.editData['image-9']) {
                    this.app.image_edit_plans.push(this.editData['image-9']);
                }
                if (this.editData['image-10']) {
                    this.app.image_edit_plans.push(this.editData['image-10']);
                }
                this.router.navigate([this.languageName + '/mypage/plan/editconfirmation']);
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

    getListLanguageContent() {
        this.app.get('languages', {'active': 1, 'is_display': 1}).then(res => {
            if (res.status === 200) {
                this.listLanguage = this.app.arrToList(res.json().data, 'id', 'display_name');
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

    selectPlan(key, value) {
        this.route.params.subscribe((params) => {
            if (params['id']) {
                this.plan_language = parseInt(key);
                this.plan_id = params['id'];
                this.app.get('mypage/plan/detail', {
                    plan_id: params['id'],
                    member_id: this.curMember.id,
                    language_id: key
                }).then(res => {
                    if (res.status == 200) {
                        if (res.json().data.id) {
                            this.data = res.json().data;
                            this.plan_images = res.json().data.images;
                            this.editData.id = params['id'];
                            let country_id = res.json().data.country_id;
                            this.getListCountry(this.plan_language);
                            this.app.get('cities/list_by_country', {
                                'language_id': this.plan_language,
                                'country_id': country_id
                            }).then(res => {
                                if (res.status == 200) {
                                    this.listPrefecture = this.app.arrToList(res.json().data, 'id', 'name');
                                    let country_name;
                                    this.prefecture = this.listPrefecture[this.data['city_id']];
                                    let country = this.listCountry[country_id];
                                    if (this.plan_language == this.app.constant.TRUE) {
                                        if(country == this.app.constant.COUNTRY_DEFAULT){
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + 'Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
                                        }else {
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + country+ '&zoom=16&maptype=roadmap&language=ja';
                                        }
                                    } else {
                                        if(country == this.app.constant.COUNTRY_DEFAULT){
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + 'Japan&zoom=16&maptype=roadmap&language=en&region=JP';
                                        }else {
                                            this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.data['address_meeting'] + this.prefecture + country+ '&zoom=16&maptype=roadmap&language=en';
                                        }
                                    }
                                }
                            });
                            // this.prefecture = prefecture;
                            // this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q='+res.json().data.address_meeting+this.prefecture+'Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
                            $('#plan-name').val(res.json().data.proposal_title);
                            if (this.language_id == this.app.constant.TRUE) {
                                $('.title-plan-edit').text(res.json().data.proposal_title + ' ' + this.app.ttrans('修正'));
                            } else {
                                $('.title-plan-edit').text(this.app.ttrans('The modification of the travel plan'));
                            }
                            $('#plan-meal').val(res.json().data.meal);
                            $('#content').val(res.json().data.content);
                            $('#guide_perparation').val(res.json().data.guide_perparation);
                            $('#guest_perparation').val(res.json().data.guest_perparation);
                            $('#participation_case').val(res.json().data.participation_case);
                            $('#other').val(res.json().data.other);
                            $('#plan-address').val(res.json().data.address_meeting);
                            var timeRequest = res.json().data.time_request.split(':');
                            $('#time_request_hour').val(timeRequest[0]);
                            $('#time_request_min').val(timeRequest[1]);
                            $('#min_number').val(res.json().data.min_people);
                            $('#max_number').val(res.json().data.max_people);
                            $('#plan-price').val(res.json().data.price);
                            $('#plan-term').val(res.json().data.num_before_deadline);
                            this.selectedPrefecture = parseInt(res.json().data.city_id);
                            this.checkedTimeApply = parseInt(res.json().data.time_apply);

                            this.Languages.language = res.json().data.languages;
                            var minHour;
                            var planHourMin = [];
                            $.each(res.json().data.time_start, function (index, value) {
                                minHour = value.split(':');
                                planHourMin.push({plan_hour: minHour[0], plan_min: minHour[1]})
                            });
                            this.timeStart.time = planHourMin;

                            var checkedCate = [];
                            $.each(res.json().data.categories, function (index, value) {
                                checkedCate.push(value.id);
                            });
                            this.checkedCategory = checkedCate;
                            this.app.get('categories/get_categories_by_language', {language_id: key}).then(res => {
                                if (res.status == 200) {
                                    this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
                                }
                            });
                            if(this.data['proposal_title'] == null){
                                this.addPlan = true;
                            }else {
                                this.addPlan = false;
                            }
                        } else {
                            alert(this.app.ttrans('データなし'));
                            // this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q='+res.json().data.address_meeting+this.prefecture+'Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
                            // $('#plan-name').val('');
                            // $('#plan-meal').val('');
                            // $('#content').val('');
                            // $('#guide_perparation').val('');
                            // $('#guest_perparation').val('');
                            // $('#participation_case').val('');
                            // $('#other').val('');
                            // $('#plan-address').val('');
                            // this.app.get('categories/get_categories_by_language', {language_id: language_plan}).then(res => {
                            //     if (res.status == 200) {
                            //         this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
                            //     }
                            // });

                            // if(key == 1 || key == 2){
                            //     this.app.get('categories/get_categories_by_language', {language_id: key}).then(res => {
                            //         if (res.status == 200) {
                            //             this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
                            //         }
                            //     });
                            // }else {
                            //     this.app.get('categories/get_categories_by_language', {language_id: 2}).then(res => {
                            //         if (res.status == 200) {
                            //             this.listCategory = this.app.arrToList(res.json().data, 'id', 'name');
                            //         }
                            //     });
                            // }
                        }

                    }
                });
            }
        });
    }

    deleteImageFromConfirm(key, name) {
        this.app.image_edit_plans.splice(key, 1);
        $('.add-image-edit-' + key).remove();
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

