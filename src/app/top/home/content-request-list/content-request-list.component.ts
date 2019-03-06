import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'content-request-list',
    templateUrl: './content-request-list.component.html',
    styleUrls: ['./content-request-list.component.css']
})
export class ContentRequestListComponent implements OnInit {
    @Input() public listRequest;
    @Input() public countData;
    @Input() public curMember;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
    }
}
