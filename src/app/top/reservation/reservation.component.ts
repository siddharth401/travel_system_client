import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../shared/app.service";

@Component({
    selector: 'top-reservation',
    templateUrl: './reservation.component.html',
    styleUrls:[
        '../../../assets/top/css/reservation.css'
    ]
})
export class ReservationComponent implements OnInit {
    private language = this.app.getCurrentLanguage();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        
    }
}
