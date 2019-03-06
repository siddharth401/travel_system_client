import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'top-mypage-apply-detail',
    templateUrl: './detail.component.html',
    styleUrls: [
        './detail.component.css',
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class MypageApplyDetailComponent implements OnInit {
    private params = {language_id: '', member_id: 1, booking_id: 1, page: 1};
    private detail = {apply_detail: {}, date_actual: '',address: '', dayofweek: '', name: '', guider_status_go: 0, traveler_status_not_go: 0, phone: '', phone_code: '', country_id: 1, status: '', members: {phone: '', phone_code: ''}, customer_languages: []};
    private language = this.app.getCurrentLanguage();
    private data = {booking_id: 1, form_confirm: false, form_complete: false, is_agree_conditions: false};
    private data_cancel = {booking_id: 1, content: '', form_confirm: false, form_complete: false, is_agree_conditions: false};
    private addressMap;
    private day_str;
    private error = {};
    private listLanguages;
    private listCountry;
    private today = new Date().toISOString().slice(0, 10);
    private date_actual_convert;
    private listPrefectures;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit() {
        this.app.checkAuth();
        this.app.checkDisplayLanguage(this.app.language_url);
        this.setTitleAndDescription();
        this.app.curMember = this.app.getConfig('CURRENT_MEMBER') ? JSON.parse(this.app.getConfig('CURRENT_MEMBER')) : null;
        if(this.app.curMember) {
            this.getApplyDetail();
        }
        this.getLisLanguages();
        this.getListCountry();
        this.getListPrefectures();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅ガイド：応募詳細 l マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅プランへの応募詳細確認画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getApplyDetail() {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID');
        let booking_id = this.route.snapshot.paramMap.get('id') ? parseInt(this.route.snapshot.paramMap.get('id')) : 1;
        this.params.language_id = top_lang_id;
        let current_id = this.app.curMember && this.app.curMember.id ? this.app.curMember.id : null;
        this.params.member_id = current_id;
        this.params.booking_id = booking_id;
        this.app.get('mypage/apply/detail', this.params).then(res =>
        {
            if (res.status == 200) {
                this.detail = res.json().data;
                this.date_actual_convert = this.app.datex(this.detail.date_actual, "YYYY-MM-DD");
                this.day_str = this.app.getDayOfWeek(parseInt(this.detail.dayofweek));
                // this.detail.phone = this.app.convertPhoneNumber(this.detail.phone);
                this.app.setConfig('APPLY_BOOKING_NAME', this.detail.name);
                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.detail.address + ',Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
            } else if(res.status == 401) {
                alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                this.router.navigate([this.language]);
            } else {
                this.router.navigate(['page/not-found']);
            }
        });
    }

    guiderApprove(id, date_actual) {
        var today = new Date().toISOString().slice(0, 10);
        var date_actual_convert = this.app.datex(date_actual, "YYYY-MM-DD");
        if(today == date_actual_convert) {
            alert(this.app.ttrans("期限が過ぎましたので、承認できなくなります。"));
        } else {
            if(confirm(this.app.ttrans("旅プランが承認されます。よろしいでしょうか？"))) {
                //change status booking to guider approved
                this.data.booking_id = id;
                this.data.form_complete = true;
                this.data.is_agree_conditions = false;
                this.app.post('mypage/reservation/approval', this.data).then(res => {
                    if (res.status === 200) {
                        this.detail.status = this.app.constant.AFTER_EXECUTE;
                    } else {
                        if(res.json().booking_id && res.json().booking_id[0]) {
                            alert(this.app.ttrans(res.json().booking_id[0]));
                        }
                        //this.router.navigate(['page/payment/error']);
                    }
                });
            } else {
                //don't change status booking
            }
        }        
    }

    showPopup(id, date_actual = null) {
        var today = new Date().toISOString().slice(0, 10);
        var date_actual_convert = this.app.datex(date_actual, "YYYY-MM-DD");
        if(date_actual && today == date_actual_convert) {
            alert(this.app.ttrans("期限が過ぎましたので、承認できなくなります。"));
        } else {
            window.scrollTo(0, 0);
            $(".modal-dialog").css("display", "block");
        }
    }

    guiderCancelBooking(id) {
        this.data_cancel.booking_id = id;
        this.data_cancel.content = $("#content-reason").val();
        this.data_cancel.form_complete = true;
        this.data_cancel.form_confirm = true;
        this.data_cancel.is_agree_conditions = true;
        this.app.post('mypage/reservation/guider_cancel', this.data_cancel).then(res => {
            if (res.status === 200) {
                this.app.setConfig('APPLY_BOOKING_NAME', res.json().booking_name);
                this.router.navigate([this.language+'/mypage/apply']);
            } else {
                this.error = res.json();
                $(".msg_err").css("display", "block");
            }
        });
    }

    showPopupNotApproved(id, date_actual) {
        var today = new Date().toISOString().slice(0, 10);
        var date_actual_convert = this.app.datex(date_actual, "YYYY-MM-DD");
        if(today == date_actual_convert) {
            alert(this.app.ttrans("期限が過ぎましたので、承認できなくなります。"));
        } else if(today > date_actual_convert) {
            alert(this.app.ttrans("実行日が過ごしましたので、リクエスト非承認を行うことができません。"));
        } else {
            if (confirm(this.app.ttrans("このプランを非承認します。よろしいでしょうか？"))) {
                window.scrollTo(0, 0);
                $(".modal-dialog").css("display", "block");
            } else {
                //don't change status booking
            }
        }
    }

    notComeBooking(id, date_actual) {
        var today = new Date().toISOString().slice(0, 10);
        var date_actual_convert = this.app.datex(date_actual, "YYYY-MM-DD");
        if(today == date_actual_convert) {
            alert(this.app.ttrans("期限が過ぎましたので、承認できなくなります。"));
        } else {
            if (confirm(this.app.ttrans("ユーザーが実施キャンセルになりました。管理者は確認します。少々お待ちください。"))) {
                this.data.booking_id = id;
                this.data.form_complete = true;
                this.data.form_confirm = true;
                this.data.is_agree_conditions = false;
                this.app.post('mypage/reservation/not_come', this.data).then(res => {
                    if (res.status === 200) {
                        this.detail.traveler_status_not_go = this.app.constant.TRUE;
                        alert(this.app.ttrans(res.json().message));
                    } else {
                        alert("Cannot change status this booking!");
                    }
                });
            } else {
                //don't change status booking
            }
        }
    }

    implementBooking(id) {
        if(confirm(this.app.ttrans("このプランを実施しましたか。"))) {
            //change status booking to cancel
            this.data.booking_id = id;
            this.data.form_complete = true;
            this.data.form_confirm = true;
            this.data.is_agree_conditions = false;
            this.app.post('mypage/reservation/done', this.data).then(res => {
                if (res.status === 200) {
                    this.detail.guider_status_go = this.app.constant.TRUE;
                } else {
                    /*this.router.navigate(['page/payment/error']);*/
                    alert("Cannot change status this booking!");
                }
            });
        } else {
            //don't change status booking
        }
    }

    reviewUser(id) {
        this.router.navigate([this.language+'/mypage/apply/detail/'+id+'/user_hyouka']);
    }

    messageInput(booking_id) {
        this.router.navigate([this.language+'/mypage/apply/detail/'+booking_id+'/messageinput']);
    }

    close_modal(){
        $(document).on('click', '#close_modal', function () {
            $(".modal-dialog").css("display","none");
            $(".msg_err").css("display", "none");
        });
    }

    getLisLanguages() {
        this.app.get('languages').then(res =>
        {
            if (res.status == 200) {
                this.listLanguages = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }

    getListCountry(){
        this.app.get('countries/frontend_lists', {'type': this.app.constant.COUNTRY_IS_PROFILE, 'language_id': this.app.getConfig('TOP_LANG_ID')}).then(res =>
        {
            if (res.status == 200) {
                this.listCountry = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }

    getListPrefectures() {
        this.app.get('prefectures/frontend_lists', {'language_id':this.app.getConfig('TOP_LANG_ID')}).then(res => {
            if (res.status === 200) {
                this.listPrefectures = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }

}
