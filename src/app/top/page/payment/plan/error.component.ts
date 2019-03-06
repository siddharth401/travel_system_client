import { Component, OnInit } from '@angular/core';
import { AppService } from "../../../../shared/app.service";

@Component({
    selector: 'top-payment-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class PaymentErrorComponent implements OnInit {
    private plan_id;
    private plan_title;

    constructor(
        private app: AppService
    ) { }

    ngOnInit() {
        this.app.checkDisplayLanguage(this.app.language);
        if(this.app.getConfig('confirmBooking')){
            let confirmBooking = this.getConfirmBooking();
            this.plan_id = confirmBooking.booking.plan_id;
            this.plan_title = confirmBooking.booking.title;
            if(this.app.getConfig('bookingId')){
                this.app.delConfig('bookingId');
            }
            this.app.delConfig('confirmBooking');
        }else {
        }
    }

    getConfirmBooking() {
        var confirmBooking = this.app.getConfig('confirmBooking');
        var booking = JSON.parse(confirmBooking);
        return booking;
    }

}
