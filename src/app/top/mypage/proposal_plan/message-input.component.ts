import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';


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
    private plan_title;
    private error = '';
    private currentGuider = this.app.getCurrentMember();
    private currentID = this.app.getCurrentMember();
    private languageName = this.app.language;
    private language_id = this.app.getConfig('TOP_LANG_ID');
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    public listMessage={data:[],total:'',last_page: '', current_page: ''};

    private data = {
        'plan_id': '',
        'member_id': '',
        'language_id': this.language_id,
        'content':'',
    };

    ngOnInit() {
        this.app.checkAuth();
        if(this.app.curMember) {
            window.scroll(0,0);
            System.import('script-loader!assets/top/js/legacy.js');
            this.app.checkDisplayLanguage(this.languageName);
            this.route.params.subscribe((params) => {
                if (params['id']) {
                    this.plan_id = params['id'];
                    this.data.plan_id = params['id'];
                    this.app.get('message_for_plan_for_guider', {plan_id: params['id'], language_id: this.language_id}).then(res => {
                        if (res.status == 200) {
                            if(res.json().alert == true){
                                alert(this.app.ttrans('相手の宛が存在していないので、メッセージをおくられません。'));
                                this.router.navigate([this.languageName+"/mypage/proposal_plan/detail/"+this.plan_id]);
                            }else {
                                this.listMessage = res.json().data;
                            }
                        }
                    });
                    this.app.get('mypage/detail_suggest_plan',{plan_id:params['id'],language_id:this.language_id}).then(res=>{
                        if(res.status == 200){
                            if(res.json().data.alert){
                                alert(this.app.ttrans('ユーザーの旅リクエストが現在存在していません。'));
                                this.router.navigate([this.languageName]);
                            } else {
                                this.plan_title = res.json().data.detailSuggestPlan.title;
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
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page - input the message about the proposal of the travel request - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page - the message input screen about the travel request proposal. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

    confirmSave(){
        if($('#messcontent').val() != '' && $('#messcontent').val().length <= 500){
            this.error = '';
            window.scrollTo(0,0);
            $('.modal-body__text').text($('#messcontent').val());
            this.data.content = $('#messcontent').val();
            $(".modal-dialog").css("display","block");
        }

    // $('#messcontent').val().length < 500
        if($('#messcontent').val() == ''){
            this.error = 'メッセージの内容を入力してください。';
        }
        if($('#messcontent').val().length > 500){
            this.error = 'F34_メッセージ内容は 500 文字以内で入力してください。';
        }

    }

    close_modal(){
        $(document).on('click', '#close_modal', function () {
            $(".modal-dialog").css("display","none");
            window.scrollTo(0,500);
        });
    }

    saveMessage(){
        this.data.member_id = this.currentID.id;
        this.data.plan_id = this.plan_id;
        this.error = '';
        this.app.post('save_message_for_guider', this.data).then(res => {
            if (res.status == 200) {
                this.router.navigate([this.languageName + '/mypage/proposal_plan/detail/'+this.plan_id+'/message_send']);
            }else {
                $(".modal-dialog").css("display","none");
                this.error = res.json().content[0];
            }
        });
    }


    loadMore() {
        this.route.params.subscribe((params) => {
            if (params['id']) {
                if (this.listMessage.last_page > this.listMessage.current_page) {
                    this.app.get('message_for_plan', {page:this.listMessage.current_page+1,plan_id: params['id'], language_id: this.language_id}).then(res => {
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

}

