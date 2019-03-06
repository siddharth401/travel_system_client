import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";


@Component({
    selector: 'top-question-answers',
    templateUrl: './question-answers.component.html',
    styleUrls: [
        '../../../../assets/top/css/question.css',
    ]
})
export class QuestionAnswersComponent implements OnInit {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit() {
        window.scrollTo(0,0);
        this.app.checkDisplayLanguage(this.app.language);
        this.setTitleAndDescription();
    }
    setTitleAndDescription() {
        this.app.setTitle(this.app.ttrans('よくある質問　l　マッチングガイド - MATCHING GUIDE'));
        $("meta[name='description']").remove();
        this.app.setMeta([
            {
                name: 'description',
                content: this.app.ttrans('マッチングガイドのよくある質問一覧です。よく分からないことがあったらまずはご一読ください。マッチングガイドはありきたりな旅行ではなくオリジナルの旅をしたい人と、そんな旅行者を案内したい人が出会うサイトです。')
            }
        ]);

    }

}