import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'content-review',
    templateUrl: './content-review.component.html',
    styleUrls: ['./content-review.component.css']
})
export class ContentReviewComponent implements OnInit {
    @Input() public listReview;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
    }
}
