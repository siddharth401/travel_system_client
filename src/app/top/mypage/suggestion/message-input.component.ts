import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';
// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

@Component({
    selector: 'message-input',
    templateUrl: './message-input.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './message-input.component.css'
    ]
})
export class MessageInputComponent implements OnInit {
    private plan_id;
    private currentGuider = this.app.getCurrentMember();
    // private currentID = this.app.getCurrentMember().id;
    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    public listMessage={data:[],total:'',last_page: '', current_page: ''};
    private request_id;
    private request_title;
    private plan_title;
    private error = '';
    private data = {
        'plan_id': '',
        'member_id': '',
        'language_id': this.language_id,
        'content':'',
    };

    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.app.checkDisplayLanguage(this.languageName);
        this.route.params.subscribe((params) => {
            if (params['id'] && this.app.curMember) {
                this.plan_id = params['id'];
                this.data.plan_id = params['id'];
                this.app.get('message_for_plan', {plan_id: params['id'], language_id: this.language_id}).then(res => {
                    if (res.status == 200) {
                        if(res.json().alert == true){
                            alert(this.app.ttrans('相手の宛が存在していないので、メッセージをおくられません。'));
                            this.router.navigate([this.languageName+"/mypage/suggestion/detail/"+this.plan_id]);
                        }else {
                            this.listMessage = res.json().data;
                            this.app.get('mypage/suggestion/suggest_plan', {plan_id: params['id'], language_id: this.language_id}).then(res => {
                                if (res.status == 200) {
                                    this.data = res.json().data;
                                    this.request_id = res.json().data.request.id;
                                    this.request_title = res.json().data.request.title;
                                    this.plan_title = res.json().data.plan_suggest.proposal_title;
                                }
                            });
                        }

                    } else {
                        alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
                        this.router.navigate([this.languageName]);
                    }
                });


            }
        });
        this.setTitleAndDescription();
    }

    ngAfterViewChecked(){
        if(this.app.getCurrentMember() && this.app.getCurrentMember().type == this.app.constant.MEMBER_GUIDER){
            $('.guide-user').text(this.app.ttrans('旅ガイド/旅ユーザー'));
        }
    }

    confirmSave(){
        if($('#messcontent').val() != '' && $('#messcontent').val().length <= 500){
            window.scrollTo(0,200);
            this.error = '';
            $('.modal-body__text').text($('#messcontent').val());
            this.data.content = $('#messcontent').val();
            $(".modal-dialog").css("display","block");
        }

        // $('#messcontent').val().length < 500
        if($('#messcontent').val() == ''){
            this.error = 'F34_メッセージ内容を入力してください。';
        }
        if($('#messcontent').val().length > 500){
            this.error = 'F34_メッセージ内容は 500 文字以内で入力してください。';
        }


    }

    close_modal(){
        $(document).on('click', '#close_modal', function () {
            $(".modal-dialog").css("display","none");
        });
    }

    saveMessage(){
        if(this.currentGuider){
            this.data.member_id = this.app.getCurrentMember().id;
            this.data.plan_id = this.plan_id;
        }
        this.app.post('save_message', this.data).then(res => {
            if (res.status == 200) {
                this.router.navigate([this.languageName + '/mypage/suggestion/detail/'+this.plan_id+'/message_send']);
            }
        });
    }

    loadMore() {
        this.route.params.subscribe((params) => {
            if (params['id']) {
                if (this.listMessage.last_page > this.listMessage.current_page) {
                    this.app.get('message_for_plan', {
                        plan_id: params['id'],
                        language_id: this.language_id,
                        page:this.listMessage.current_page+1
                    }).then(res => {
                        if (res.status == 200) {
                            let data = res.json().data;
                            this.listMessage.current_page = data.current_page;
                            this.listMessage.last_page = data.last_page;
                            this.listMessage.data = this.listMessage.data.concat(data.data);
                        }
                    });
                }
            }
        });
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page -  message input about proposal of the the travel request- MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page -the message input screen about the travel request proposal. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

}

