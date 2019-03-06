import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../../shared/form-data';


@Component({
    selector: 'mypage-reservationtour-review-register',
    templateUrl: './review_register.component.html',
    styleUrls: [
        './review_register.component.css',
        '../../../../../../assets/top/css/mypage.css'
    ]
})
export class ReviewRegisterComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getCurrentLanguage();
    private curMember = this.app.getCurrentMember();
    private checked;
    private addressMap;
    private booking_id;
    private addressBooking;
    private review = {address:'',date_actual:'',proposal_title:'',date_plan:'',address_meeting:'',booking_review:{point: 0, content: '',id:null,status:0}};
    private data = {
                    'content' : '',
                    'point' : 0,
                    'booking_id': '',
                    'id':null,
                    'language_id' : this.language_id,
                    'member_id' :'',
                    'form_confirm': true
    };
    private point;
    private content;
    private googleMapLink;
    private error = {};
    private listPoin;
    private disabled = true;
    private date_str;

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        let curMember = this.app.getCurrentMember();
        this.data.member_id = curMember ? curMember.id : 1;
        this.app.checkDisplayLanguage(this.languageName);
        this.route.params.subscribe((params) =>{
            this.booking_id = params['id'];
        });
        this.setTitleAndDescription();
        if(curMember) {
            this.getReview();
        }
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - 旅プラン口コミ登録　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - 体験した旅プランの口コミ登録画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getReview(){
        this.app.get('mypage/reviews/register_form',{'booking_id' : this.booking_id,'language_id' : this.language_id}).then(res => {
            if (res.status == 200) {
                this.review = res.json().data;
                let booking_date = new Date(this.review.date_actual.slice(0,10));
                let date = booking_date.getDay();
                this.date_str = this.app.getDayOfWeek(date);
                this.point = this.review.booking_review ? this.review.booking_review.point : 0;
                this.listPoin = this.rating(this.point);
                this.data.point = this.review.booking_review ? this.review.booking_review.point : 0;
                this.data.content = this.review.booking_review ? this.review.booking_review.content : '';
                this.data.id = this.review.booking_review ? this.review.booking_review.id : null;
                this.disabled = this.review.booking_review && this.review.booking_review.status != this.app.constant.FALSE ? true : false;
                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.review.address_meeting + ',Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
            } else if(res.status == 401) {
                alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                this.router.navigate([this.languageName]);
            } else {
                this.router.navigate(['page/not-found']);
            }
        });
    }

    confirmSave(){
        if($('#check-privacy:checkbox:checked').length == 1){
            if(this.review['active'] != this.app.constant.TRUE){
                alert(this.app.ttrans('相手の宛が存在していないので、メッセージをおくられません。'));
            }else {
                if((this.review['plan_status']) == this.app.constant.GuiderStatus.STOP_PUBLIC){
                    alert(this.app.ttrans('旅プランが存在していないので、口コミを登録できません。'));
                }else {
                    this.checked = '';
                    this.data.booking_id = this.booking_id;
                    this.app.post('mypage/reviews/register', this.data).then(res => {
                        if(res.status == 200){
                            this.data['form_confirm'] = true;
                            $(".modal-dialog").css("display","block");
                        }
                        else {
                            this.error = res.json();
                        }
                    });
                }
            }

        } else {
            // this.checked = this.app.ttrans('Please check the consent of the terms of service agreement.');
            this.checked = this.app.ttrans('「口コミ規定」に同意するチェックを入ってください。');
        }
    }
    checkChecked(){
        if($('#check-privacy:checkbox:checked').length == 1){
            this.checked = '';
        }else {
            this.checked = this.app.ttrans('「口コミ規定」に同意するチェックを入ってください。');
        }

    }

    close_modal(){
        this.error= {};
        // $(document).on('click', '#close_modal', function () {
            $(".modal-dialog").css("display","none");
        // });
    }
    save_data(){
        this.data['form_complete'] = true;
        this.app.post('mypage/reviews/register', this.data).then(res => {
            if (res.status == 200) {
                this.app.setConfig('F24_title_plan',this.review.proposal_title);
                this.router.navigate([this.languageName + '/mypage/reservationtour/detail/'+ this.booking_id+'/review_completation']);
            }
        });
    }

    vote(i) {
        this.data.point = i + 1;
        this.listPoin = this.rating(this.data.point);
    }


    rating(number) {
        let tmp = Math.ceil(number);
        let result = [];
        for (var i = 1;  i <= 5; i++)
        {
            var value = true;
            if( i > tmp)
            {
                value = false;
            }
            result.push({key: value})
        }
        return result;
    }
}

