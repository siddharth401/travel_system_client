import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../../shared/app.service";
import {parse} from "ts-node/dist/index";

@Component({
    selector: 'top-mypage-request-detail',
    templateUrl: './detail.component.html',
    styleUrls: [
        './detail.component.css',
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class MypageRequestDetailComponent implements OnInit {
    private params = {language_id: '', member_id: 1, request_id: 1, page: 1};
    private detail = {suggestions: {current_page: 1, last_page: 1, data: []}, request_detail: {status: 1, dayofweek_date_end: '', dayofweek_created_at: '', dayofweek_date_plan: ''}};
    private language = '';
    private data = {booking_id: 1, form_confirm: false, form_complete: false, is_agree_conditions: false };
    private curMember;
    private listLanguages;
    private request_id;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit() {
        this.app.checkAuth();
        window.scrollTo(0,0);
        this.curMember = this.app.getCurrentMember();
        this.app.checkDisplayLanguage(this.app.language_url);
        this.language = this.app.getCurrentLanguage();
        this.setTitleAndDescription();
        if(this.curMember) {
            this.getRequestDetail();
        }
        this.getLisLanguages();
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅リクエスト詳細 l マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅リクエスト詳細。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getRequestDetail() {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID');
        let request_id = this.route.snapshot.paramMap.get('id') ? parseInt(this.route.snapshot.paramMap.get('id')) : 1;
        this.params.language_id = top_lang_id;
        this.params.member_id = this.curMember && this.curMember.id ? this.curMember.id : null;
        this.params.request_id = request_id;
        this.request_id = request_id;
        this.app.get('mypage/requests/detail', this.params).then(res =>
        {
            if (res.status == 200) {
                this.detail = res.json().data;
                this.detail.request_detail.dayofweek_date_end = this.app.getDayOfWeek(parseInt(res.json().data.request_detail.dayofweek_date_end));
                this.detail.request_detail.dayofweek_created_at = this.app.getDayOfWeek(parseInt(res.json().data.request_detail.dayofweek_created_at));
                this.detail.request_detail.dayofweek_date_plan = this.app.getDayOfWeek(parseInt(res.json().data.request_detail.dayofweek_date_plan));
            } else if (res.status == 401) {
                alert('このリンクはあなたがアクセスできません。');
                this.router.navigate([this.language]);
            } else {
                this.router.navigate(['page/not-found']);
            }
        });
    }

    loadMore(data){
        let top_lang_id = this.app.getConfig('TOP_LANG_ID') ? this.app.getConfig('TOP_LANG_ID') : 1;
        if(data.last_page > data.current_page)
        {
            this.params.page = this.detail.suggestions.current_page + 1;
            this.params.language_id = top_lang_id;
            this.params.member_id = this.curMember.id;
            let request_id = this.route.snapshot.paramMap.get('id') ? parseInt(this.route.snapshot.paramMap.get('id')) : 1;
            this.params.request_id = request_id;
            this.app.get('mypage/requests/detail', this.params).then(res =>
            {
                if (res.status == 200) {
                    let data = res.json().data.suggestions;
                    this.detail.suggestions.current_page = data.current_page;
                    this.detail.suggestions.last_page = data.last_page;
                    this.detail.suggestions.data = this.detail.suggestions.data.concat(data.data);
                }
            });
        }
    }

    changeStatus(data, status) {
        let params = {
            request_id: data.id,
            language_id: data.language_id,
            status: status
        };
        this.app.post('mypage/requests/change_status', params).then(res => {
            if (res.status == 200) {
                this.detail.request_detail.status = status;
                $(".modal-dialog").css("display","none");
            }
        });
    }

    showPopup() {
        //show popup then input reason for cancel booking from guider
        $(".modal-dialog").css("display", "block");
    }

    close_modal() {
        $(document).on('click', '.close_modal', function () {
            $(".modal-dialog").css("display","none");
        });
    }

    updateDeadline() {
        var request_id = this.request_id;
        let url = this.app.constant.BASE_API+"mypage/requests/change_date";
        let top_token = this.app.getConfig('TOP_TOKEN');
        let language_id = this.app.top_lang_id;
        var str_error = this.app.ttrans('募集期日は実施日より５日前までに設定する必要がある。更新できない場合、別のリクエストを作成してください。');
        if(language_id == this.app.constant.JA_LANGUAGE_ID) {
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
            var monthsFull = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Sep', 'Dec'];
            var weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        }
        System.import('script-loader!assets/top/js/picker.js').then(()=> {
            System.import('script-loader!assets/top/js/picker.date.js').then(()=> {
                $(document).ready(function () {
                    //今日の日付を取得してカレンダーに設定
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    var week = date.getDay();
                    var day = date.getDate();

                    $('#change-deadline').pickadate({
                        monthsFull: monthsFull,
                        weekdaysShort: weekdaysShort,
                        today: today,
                        clear: clear,
                        close: close,
                        labelMonthNext: labelMonthNext,
                        labelMonthPrev: labelMonthPrev,
                        format: 'yyyy/mm/dd',
                        min: [year, month, day],
                        onSet: function() {
                            let date_select = this.get('select', 'yyyy-mm-dd');
                            if(date_select) {
                                $.ajax({
                                    type: 'POST',
                                    url: url,
                                    data: { request_id: request_id, date_end : date_select, top_token: top_token, language_id: language_id},
                                    success: function(res) {
                                        let date_end = new Date(res.date);
                                        let date_end_day = date_end.getDate() >= 10 ? date_end.getDate() : '0' + date_end.getDate();
                                        let date_end_month_tmp = date_end.getMonth() + 1;
                                        let date_end_month = date_end_month_tmp >= 10 ? date_end_month_tmp : '0' + date_end_month_tmp;
                                        let date_end_year = date_end.getFullYear();
                                        let date_end_str = "";
                                        let day_str = "";
                                        if(parseInt(language_id) == 1) {
                                            date_end_str = date_end_year + "/" + date_end_month + "/" + date_end_day;
                                            //set day of week with date end
                                            switch (parseInt(res.day_of_week)) {
                                                case 1:
                                                    day_str = '月';
                                                    break;
                                                case 2:
                                                    day_str = '火';
                                                    break;
                                                case 3:
                                                    day_str = '水';
                                                    break;
                                                case 4:
                                                    day_str = '木';
                                                    break;
                                                case 5:
                                                    day_str = '金';
                                                    break;
                                                case 6:
                                                    day_str = '土';
                                                    break;
                                                case 0:
                                                    day_str = '日';
                                                    break;
                                                default:
                                                    break;
                                            }
                                        } else {
                                            date_end_str = date_end_year + "/" + date_end_month + "/" + date_end_day;
                                            //set day of week with date end
                                            switch (parseInt(res.day_of_week)) {
                                                case 1:
                                                    day_str = 'Mon';
                                                    break;
                                                case 2:
                                                    day_str = 'Tue';
                                                    break;
                                                case 3:
                                                    day_str = 'Wed';
                                                    break;
                                                case 4:
                                                    day_str = 'Thu';
                                                    break;
                                                case 5:
                                                    day_str = 'Fri';
                                                    break;
                                                case 6:
                                                    day_str = 'Sat';
                                                    break;
                                                case 0:
                                                    day_str = 'Sun';
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                        date_end_str = date_end_str + ' (' + day_str + ')';
                                        $("#set-date-end").html(date_end_str);
                                    },
                                    error: function(error){
                                        alert(str_error);
                                    }
                                });
                            }
                        },
                        onClose: function() {
                            $(document.activeElement).blur();
                        }
                    });
                });
            });
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
    
}
