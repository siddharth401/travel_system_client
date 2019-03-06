import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/app.service';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Filter } from "../shared/filter/filter";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    private filter;
    private listMembers = {};
    private listGuiders = {};
    private listUsers = {};
    private bookings = { data:[] };
    private curDate = new Date();
    private params = {'date_plan_from': '', 'date_plan_to': '',
                        'date_actual_from': '', 'date_actual_to': '',
                        'member_name': '', 'email': '',
                        'status': [], 'guider_status': [], 'user_status': [],
                        'payment_status': [],
                        'classification': [], 'sort': 'id',
                        'direction': 'desc', 'page': 1, 'is_download': false};
    private is_search = false;

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        window.scrollTo(0,0);
        this.route.params.subscribe((params) => {
            this.params["page"] = params.page ? params.page : 1;
            this.search(false);
        });
        this.getListMembers();
        this.getListGuiders();
        this.getListUsers();

        System.import('script-loader!jquery-ui-npm/jquery-ui.min.js').then(()=>{
            //date picker
            $(document).ready(function(){
                $( ".datepicker" ).datepicker(
                    {
                        dateFormat: 'yy/mm/dd'
                    }
                );
            });
        });
    }
    getListMembers()
    {
        this.app.get('members', {type: this.app.constant.MEMBER_USER}).then(res =>
        {
            if (res.status == 200) {
                this.listMembers = this.app.arrToList(res.json().data, 'id','name');
            }
        });
    }

    getListGuiders()
    {
        this.app.get('members', {'type':this.app.constant.MEMBER_GUIDER}).then(res =>
        {
            if (res.status == 200) {
                this.listGuiders = this.app.arrToList(res.json().data, 'id','name');
            }
        });
    }

    getListUsers() {
        this.app.get('users').then(res =>
        {
            if (res.status == 200) {
                this.listUsers = this.app.arrToList(res.json().data, 'id','username');
            }
        });
    }

    reset() {
        this.params = {'date_plan_from': '', 'date_plan_to': '',
            'date_actual_from': '', 'date_actual_to': '',
            'member_name': '', 'email': '','sort': '', 'classification': [], 'user_status': [], 'guider_status': [], 'status': [], 'payment_status': [],
            'direction': '', 'page': 1, 'is_download': false};
        $('[name="date_plan_from"]').val("");
        $('[name="date_plan_to"]').val("");
        $('[name="date_actual_from"]').val("");
        $('[name="date_actual_to"]').val("");
        $(".checkbox-status").prop('checked', false);
    }

    onChangeClassification(e) {
        var isChecked = e.target.value;
        if(this.params.classification.includes(isChecked)) {
            this.params.classification.splice(this.params.status.indexOf(isChecked), 1);
        } else {
            this.params.classification.push(isChecked);
        }
    }

    onChangeStatus(e) {
        var isChecked = e.target.value;
        //if isChecked = 4, add status 4,5 to array
        //if isChecked = 2, search with status is 3 and date_actual < today
        if(this.params.status.includes(isChecked)) {
            this.params.status.splice(this.params.status.indexOf(isChecked), 1);
            if(isChecked == 4) {
                this.params.status.splice(this.params.status.indexOf(this.app.constant.REVIEWED), 1);
            }
        } else {
            this.params.status.push(isChecked);
            if(isChecked == 4) {
                this.params.status.push(this.app.constant.REVIEWED);
            }

        }
    }

    onChangeUserStatus(e) {
        var isChecked = e.target.value;
        if(this.params.user_status.includes(isChecked)) {
            this.params.user_status.splice(this.params.user_status.indexOf(isChecked), 1);
        } else {
            this.params.user_status.push(isChecked);
        }
    }

    onChangeGuiderStatus(e) {
        var isChecked = e.target.value;
        if(this.params.guider_status.includes(isChecked)) {
            this.params.guider_status.splice(this.params.guider_status.indexOf(isChecked), 1);
        } else {
            this.params.guider_status.push(isChecked);
        }
    }

    onChangePaymentStatus(e) {
        var isChecked = e.target.value;
        if(this.params.payment_status.includes(isChecked)) {
            this.params.payment_status.splice(this.params.payment_status.indexOf(isChecked), 1);
        } else {
            this.params.payment_status.push(isChecked);
        }
    }

    changeSort(field) {
        if (this.params["sort"] == field) {
            this.params["direction"] = this.params["direction"]=='asc'?'desc':'asc';
        } else {
            this.params["sort"] = field;
            this.params["direction"] = 'desc';
        }

        this.search(false);
    }

    search(search = true) {
        this.is_search = search == false ? search : true;
        this.params['date_plan_from'] = $('[name="date_plan_from"]').val();
        this.params['date_plan_to'] = $('[name="date_plan_to"]').val();
        this.params['date_actual_from'] = $('[name="date_actual_from"]').val();
        this.params['date_actual_to'] = $('[name="date_actual_to"]').val();        
        var today = new Date().toISOString().slice(0, 10);

        if((this.params['date_plan_from'] != "" && this.params['date_plan_to'] != "" && this.params['date_plan_from'] > this.params['date_plan_to'])
            || (this.params['date_actual_from'] != "" && this.params['date_actual_to'] != "" && this.params['date_actual_from'] > this.params['date_actual_to'])) {
            alert(this.app.trans('The end date is needing bigger than the start date'));
        } else {
            this.app.get('bookings', this.params).then(res => {
                this.bookings = res.json().data;
                console.log(this.bookings);
                for (var index in this.bookings.data) {
                    var date_actual_convert = this.app.datex(this.bookings.data[index].date_actual, "YYYY-MM-DD");
                    if(this.bookings.data[index].date_actual && today >= date_actual_convert) {
                        this.bookings.data[index].is_already = true;
                    } else {
                        this.bookings.data[index].is_already = false;
                    }
                }
                if(search == true) {
                    this.router.navigate(['/admin/booking']);
                }
            });
        }
    }

    downloadCsv() {
        var listBooking = [
            {
                booking_id: this.app.trans("Booking ID"),
                crated_at: this.app.trans("Created at"),
                name: this.app.trans("Name"),
                number_people: this.app.trans("Number people"),
                amount: this.app.trans("Amount"),
                experience_date: this.app.trans("Experience date"),
                guider: this.app.trans("Guider"),
                message: this.app.trans("Message"),
                implementation: this.app.trans("Implementation"),
                user_approval: this.app.trans("User approval"),
                guider_approval: this.app.trans("Guide approval"),
                reviews: this.app.trans("Reviews"),
                payment_status: this.app.trans("Payment status"),
                classification: this.app.trans("Classification")
            }
        ];
        this.params['is_download'] = true;
        this.app.get('bookings', this.params).then(res => {
            if (res.status == 200) {
                var bookingList = res.json().data;
                //add element booking to list for export csv
                for (var index in bookingList) {
                    var booking = bookingList[index];
                    //user approval
                    var user_approval = "";
                    var guider_approval = "";
                    var review_status = "";
                    if(booking['traveler_status_go'] == this.app.constant.FALSE && booking['traveler_status_not_go'] == this.app.constant.FALSE) {
                        user_approval = this.app.trans('Not yet');
                    } else if(booking['traveler_status_go'] == this.app.constant.TRUE && booking['traveler_status_not_go'] == this.app.constant.FALSE) {
                        user_approval = this.app.trans('Approval');
                    } else if(booking['traveler_status_not_go'] == this.app.constant.TRUE && booking['traveler_status_go'] == this.app.constant.FALSE) {
                        user_approval = this.app.trans('Non-approval');
                    }
                    //guider approval
                    if(booking['guider_status_go'] == this.app.constant.FALSE && booking['guider_status_not_go'] == this.app.constant.FALSE) {
                        guider_approval = this.app.trans('Not yet');
                    } else if(booking['guider_status_go'] == this.app.constant.TRUE && booking['guider_status_not_go'] == this.app.constant.FALSE) {
                        guider_approval = this.app.trans('Approval');
                    } else if(booking['guider_status_not_go'] == this.app.constant.TRUE && booking['guider_status_go'] == this.app.constant.FALSE) {
                        guider_approval = this.app.trans('Non-approval');
                    }
                    //review status
                    if(booking['booking_reviews_status'] == this.app.constant.FALSE && !booking['booking_reviews_user_id']) {
                        review_status = this.app.trans('Approval');
                    } else if(booking['booking_reviews_status'] == this.app.constant.FALSE && booking['booking_reviews_user_id']) {
                        review_status = this.app.trans('Non-approval');
                    } else if(booking['status'] == this.app.constant.REVIEWED) {
                        review_status = this.app.trans('Approved');
                    }
                    listBooking.push(
                        {
                            booking_id: this.app.addFixedId(booking['id'], "Y"),
                            crated_at: this.app.datex(booking["date_plan"], "YYYY/MM/DD"),
                            name: booking["member_name"],
                            number_people: booking["number_people"],
                            amount: this.app.constant.Currency_unit[booking["amount_unit"]] ? this.app.constant.Currency_unit[booking["amount_unit"]]+booking["amount"] : booking["amount"],
                            experience_date: this.app.datex(booking["date_actual"], "YYYY/MM/DD"),
                            guider: this.listGuiders[booking["plan_member_id"]] ? this.listGuiders[booking["plan_member_id"]] : "",
                            message: booking["num_comments"] ? booking["num_comments"] : "",
                            implementation: this.app.constant.Booking.status[booking["status"]] ? this.app.trans(this.app.constant.Booking.status[booking["status"]]) : "",
                            user_approval:  user_approval,
                            guider_approval: guider_approval,
                            reviews: review_status,
                            payment_status: this.app.constant.Booking.guider_payment[booking['castposts_status']] ? this.app.trans(this.app.constant.Booking.guider_payment[booking['castposts_status']]) : "",
                            classification: booking["plans"] && booking["plans"]["request_id"] ? this.app.trans(this.app.constant.REQUEST_RESERVATION) : this.app.trans(this.app.constant.BOOK_RESERVATION)
                        }
                    );
                };

                var options = {
                    fieldSeparator: ',',
                    quoteStrings: '"',
                    decimalseparator: '.',
                    showLabels: true,
                    showTitle: true,
                    title: "",
                    useBom: true
                };

                new Angular2Csv(listBooking, 'bookings', options);
            }
        });

    }

}