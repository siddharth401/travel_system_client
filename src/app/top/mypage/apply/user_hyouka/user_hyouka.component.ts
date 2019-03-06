// import {Component, OnInit, Input} from '@angular/core';
// import {AppService} from "../../../../shared/app.service";
// import {ActivatedRoute, Router} from '@angular/router';
// import {FormData} from '../../../../shared/form-data';

import {Component, OnInit, Input} from '@angular/core';
import {AppService} from "../../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../../shared/form-data';


@Component({
    selector: 'mypage-apply-user-hyouka',
    templateUrl: './user_hyouka.component.html',
    styleUrls: [
        './user_hyouka.component.css',
        '../../../../../assets/top/css/mypage.css',
    ]
})
export class UserHyoukaComponent implements OnInit {
    private language_id = this.app.getConfig('TOP_LANG_ID');
    private languageName = this.app.getCurrentLanguage();
    private curMember = this.app.getCurrentMember();
    private checked;
    private addressMap;
    private booking_id;
    public listPoin;
    private addressBooking;
    private review = {
                      id:'',address:'',proposal_title:'',date_actual:'',created_at:'',date_plan:'',address_meeting:'',
                      member_review:{point: 0, content: '',id:null,status:0},
                      booking:{date_plan :'',date_actual:''},
    };
    private data = {
        'content' : '',
        'point' : 0,
        'booking_id': '',
        'id':null,
        'language_id' : this.language_id,
        'member_id' :'',
        'plan_id' :'',
        'form_confirm': true
    };
    private point;
    private content;
    private check_review = false;
    private googleMapLink;
    private error = {};
    private disabled = false;
    private weekday_booking_date_actual;

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.app.checkAuthGuider();
        window.scroll(0,0);
        let curMember = this.app.getCurrentMember();
        this.data.member_id = curMember ? curMember.id : 1;
        this.app.checkDisplayLanguage(this.languageName);
        this.route.params.subscribe((params) =>{
            this.booking_id = params['id'];
        });
        this.setTitleAndDescription();
        if(curMember && curMember.type == this.app.constant.MEMBER_GUIDER) {
            this.getListReview();
        }
        this.app.checkDisplayLanguage(this.languageName);
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('マイページ - 旅ガイド：ユーザー評価 l マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('マイページ - ユーザー評価入力画面。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')}
        ]);
    }

    getListReview(){
        this.app.get('mypage/apply/register_form',{'booking_id' : this.booking_id,'language_id' : this.language_id}).then(res => {
            if (res.status == 200) {
                this.review = res.json().data;
                this.data.plan_id = this.review.id;
                this.data.point = this.review.member_review ? this.review.member_review.point : 0;
                this.listPoin = this.rating(this.point);
                this.data.content = this.review.member_review ? this.review.member_review.content : '';
                if(this.review.member_review && this.review.member_review.content){
                    this.check_review = true;
                }
                this.data.id = this.review.member_review ? this.review.member_review.id : null;
                this.disabled = (this.review.member_review == null || (this.review.member_review && this.review.member_review.status == 0)) ? true : false;
                this.addressMap = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDVhqS57__b-lsmKESERp184-JiI6eOK24&q=' + this.review.address_meeting + ',Japan&zoom=16&maptype=roadmap&language=ja&region=JP';
                if(this.review.booking.date_actual){
                    let d = new Date(this.review.booking.date_actual.slice(0,10));
                    let thu = d.getDay();
                    this.weekday_booking_date_actual = this.app.getDayOfWeek(thu);
                }
            } else if(res.status == 401) {
                alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                this.router.navigate([this.languageName]);
            }
        });
    }

    confirmSave(){

        if(this.review['active'] != this.app.constant.TRUE){
            alert(this.app.ttrans('相手の宛が存在していないので、メッセージをおくられません。'));
        }else {
            if((this.review['plan_status']) == this.app.constant.GuiderStatus.STOP_PUBLIC){
                alert(this.app.ttrans('旅プランが存在していないので、口コミを登録できません。'));
            }else {
                this.data.booking_id = this.booking_id;
                this.app.post('mypage/apply/register_save', this.data).then(res => {
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


    }

    close_modal(){
        $(document).on('click', '#close_modal', function () {
            $(".modal-dialog").css("display","none");
        });
        this.error = {};
    }
    save_data(){
        this.data['form_complete'] = true;
        this.app.post('mypage/apply/register_save', this.data).then(res => {
            if (res.status == 200) {
                this.app.setConfig('F60_title_plan',this.review.proposal_title),
                this.router.navigate([this.languageName + '/mypage/apply/detail/'+ this.booking_id+'/user_hyouka_confirm']);
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

