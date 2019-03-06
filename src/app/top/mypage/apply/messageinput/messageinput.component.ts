import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'top-mypage-apply-messageinput',
    templateUrl: './messageinput.component.html',
    styleUrls: [
        '../../../../../assets/top/css/mypage.css',
        './messageinput.component.css'
    ]
})
export class MypageApplyMessageInputComponent implements OnInit {
    private current_id = this.app.curMember && this.app.curMember.id ? this.app.curMember.id : null;
    private params = {
        member_id: 1,
        booking_id: 1,
        content: '',
        form_confirm: false,
        form_complete: false
    };
    private params_list = {
        member_id: 1,
        booking_id: 1,
        page: 1
    };
    private language = this.app.getCurrentLanguage();
    private error = {};
    private booking_id;
    private reviews = {current_page: 1, last_page: 1, data: []};
    private booking_name;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        this.app.checkAuthGuider();
        this.booking_id = this.route.snapshot.paramMap.get('id') ? parseInt(this.route.snapshot.paramMap.get('id')) : 1;
        this.app.checkDisplayLanguage(this.app.language_url);
        this.app.curMember = this.app.getConfig('CURRENT_MEMBER') ? JSON.parse(this.app.getConfig('CURRENT_MEMBER')) : null;
        if(this.app.curMember && this.app.curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.getBookingDetail(this.booking_id);
        }
        this.setTitleAndDescription();

    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans("マイページ - 旅ガイド：応募メッセージ入力 l マッチングガイド - MATCHING GUIDE"));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 旅プランへの応募メッセージ入力画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
        this.getListBookingReview();
    }

    saveBookingChat() {
        this.params.content = $("#booking-chat-content").val();
        this.params.booking_id = this.booking_id;
        this.params.member_id = this.current_id;
        this.params.form_confirm = true;
        this.params.form_complete = false;

        this.app.post('mypage/apply/save_booking_review_for_guider', this.params).then(res => {
            if (res.status === 200) {
                this.showPopup(this.params.content);
            } else {
                this.error = res.json();
                $(".msg_err").css("display", "block");
            }
        });
    }

    messageSend() {
        this.params.content = $("#booking-chat-content").val();
        this.params.booking_id = this.booking_id;
        this.params.member_id = this.current_id;
        this.params.form_confirm = false;
        this.params.form_complete = true;

        this.app.post('mypage/apply/save_booking_review_for_guider', this.params).then(res => {
            if (res.status === 200) {
                this.router.navigate([this.app.language+'/mypage/apply/detail/'+this.booking_id+'/messagesend']);
            } else {
                this.error = res.json();
                $(".msg_err").css("display", "block");
            }
        });
    }

    getBookingDetail(target_booking_id) {
        let top_lang_id = this.app.getConfig('TOP_LANG_ID');
        let params = {
            language_id: top_lang_id,
            member_id: this.current_id,
            booking_id: target_booking_id
        };
        this.app.get('mypage/apply/detail', params).then(res =>
        {
            if (res.status == 200) {
                this.booking_name = res.json().data.name;
            } else if(res.status == 401) {
                alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                this.router.navigate([this.language]);
            } else {
                this.router.navigate(['page/not-found']);
            }
        });
    }
    
    getListBookingReview() {
        this.params_list.booking_id = this.booking_id;
        this.params_list.member_id = this.current_id;
        this.app.get('mypage/apply/message_for_booking_guider', this.params_list).then(res => {
            if (res.status === 200) {
                if(res.json().alert == true){
                    alert(this.app.ttrans('相手の宛が存在していないので、メッセージをおくられません。'));
                    this.router.navigate([this.app.language+"/mypage/apply/detail/"+this.booking_id]);
                }else {
                    this.reviews = res.json().data;
                }
            }
        });

    }

    loadMore(data){
        if(data.last_page > data.current_page)
        {
            this.params_list.page = parseInt(data.current_page) + 1;
            this.params_list.member_id = this.current_id;
            this.params_list.booking_id = this.booking_id;
            this.app.get('mypage/apply/message_for_booking_guider', this.params_list).then(res =>
            {
                if (res.status == 200) {
                    let data = res.json().data;
                    this.reviews.current_page = data.current_page;
                    this.reviews.last_page = data.last_page;
                    this.reviews.data = this.reviews.data.concat(data.data);
                }
            });
        }
    }

    showPopup(content) {
        //show popup then input reason for cancel booking from guider
        $("#content-message-input").html(content);
        $(".modal-dialog").css("display","block");
    }

    close_modal(){
        $(document).on('click', '#close_modal', function () {
            $(".modal-dialog").css("display","none");
            $(".msg_err").css("display", "none");
        });
    }
}
