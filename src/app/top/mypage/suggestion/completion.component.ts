import {Component, OnInit, Output, Input, ViewChild, AfterViewInit} from '@angular/core';
import {AppService} from "../../../shared/app.service";
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../../shared/form-data';


@Component({
    selector: 'plan-completion',
    templateUrl: './completion.component.html',
    styleUrls: [
        '../../../../assets/top/css/mypage.css',
        './completion.component.css'
    ]
})
export class CompletionComponent implements OnInit {
    private data: any;
    private plan_id;
    private teian_plan_booking;
    private request_id;
    private plan_title;
    private request_title;
    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }
    private languageName = this.app.language;

    ngOnInit() {
        this.app.checkAuth();
        window.scroll(0,0);
        this.app.checkDisplayLanguage(this.languageName);
        this.data = this.app.getConfig('confirmReservation');
        if (this.data && this.app.curMember) {
            // this.app.delConfig('confirmReservation');
        } else if(this.app.curMember) {
            alert(this.app.ttrans('このリンクはあなたがアクセスできません。'));
            this.router.navigate([this.app.language])
        }
        if(this.app.getConfig('detailSuggestPlan')){
            // this.app.delConfig('detailSuggestPlan');
        }

        if(this.app.getConfig('title_plan')){
            this.plan_title = this.app.getConfig('title_plan');
        }
        if(this.app.getConfig('title_request')){
            this.request_title = this.app.getConfig('title_request');
        }
        if(this.app.getConfig('booking_request_id')){
            this.request_id = this.app.getConfig('booking_request_id');
        }
        if(this.app.getConfig('booking_plan_id')){
            this.plan_id = this.app.getConfig('booking_plan_id');
        }
        if(this.app.getConfig('teian_plan_booking')){
            this.teian_plan_booking = this.app.getConfig('teian_plan_booking');
        }

        this.setTitleAndDescription()
    }

    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('My page -  Reservaion at the proposal of  the travel request was completed successfully - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {name: 'description', content: this.app.ttrans('My page - the reservation completed screen for the travel request proposal. "MATCHING GUIDE" is not a mediocre website but the best website to match the person who wants to travel. With the person who is willing to guide such wonderful travelers. To enjoy a fabulous trip.')}
        ]);
    }

    goToF30(){
        this.router.navigate([this.languageName+'/mypage/reservationtour/detail/'+this.teian_plan_booking+'/message_input']);
    }

}

