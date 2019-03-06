import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormData } from '../../shared/form-data';


@Component({
    selector: 'booking-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
    private fb;
    private data =
    {
        id: '',
        plan_id: '',
        date_plan: '',
        name: '',
        introduction: '',
        address: '',
        number_people: '',
        amount: '',
        amoun_unit: '',
        date_actual: '',
        member_id: '',
        num_comments: '',
        status: '',
        user_id: '',
        guider_status: '',
        review_status: '',
        payment_status: '',
        room_status: '',
        rating: '',
        rate: '',
        cancel_rate: '',
        gender: 0,
        email: '',
        phone: '',
        phone_code: '',
        country_id: 0,
        prefecture_id: '',
        customer_address: '',
        customer_name: '',
        customer_email: '',
        guider_status_go: 0,
        guider_status_not_go: 0,
        traveler_status_go: 0,
        traveler_status_not_go: 0,
        is_already: false,
        notify_one_day: false,
        customer_languages: [],
        plans: {
            guiders: {
                languages: []
            },
            plan_reviews: [],
            plan_translates: [],
            id: ''
        },
        members: {},
        booking_reviews:[],
        booking_chats: [],
        member_review:[],
        created_at: ''
    };
    private review;
    private listMembers = {};
    private listGuiders = {};
    private listUsers = {};
    private listCountries = {};
    private listPrefecture = {};
    private listLanguages = {};

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit()
    {
        window.scrollTo(0,0);
        this.fb = new FormData(this.app, this.data);

        this.route.params.subscribe((params) =>
        {
            if (params['id'])
            {
                this.fb.isNew = false;
                this.fb.bindData('bookings/detail',{id:params['id']});
                //separate country number and phone number
                /*if(this.fb.form.value['phone']) {
                    console.log(this.fb.form.value['phone']);
                    this.fb.form.value['phone'] = this.app.convertPhoneNumber(this.fb.form.value['phone']);
                }*/
                /*this.plan_title = this.fb.form.value['plans']['plan_translates'][0]['proposal_title'];
                console.log(this.plan_title);*/
            }
        });
        $(document).on('click', '#btn-cancel-review-booking', function () {
            $('#user-comment').show();
        })
        this.getListGuiders();
        this.getListMembers();
        this.getListCountries();
        this.getListPrefecture()
        this.getLisLanguages();
    }

    getListMembers()
    {
        this.app.get('members', {type: 1}).then(res =>
        {
            if (res.status == 200) {
                this.listMembers = this.app.arrToList(res.json().data, 'id','name');
            }
        });
    }

    getListGuiders()
    {
        this.app.get('members', {'type':2}).then(res =>
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

    getListPrefecture() {
        this.app.get('prefectures/backend_lists').then(res =>
        {
            if (res.status == 200) {
                this.listPrefecture = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }

    getListCountries() {
        this.app.get('countries').then(res =>
        {
            if (res.status == 200) {
                this.listCountries = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }

    getLisLanguages() {
        this.app.get('languages').then(res =>
        {
            if (res.status == 200) {
                this.listLanguages = this.app.arrToList(res.json().data, 'id','display_name');
            }
        });
    }
    
    clickButton(type = 1) {
        if(type == 1) {
            $("#content-information").show();
            $("#content-message").hide();
            $("#information-button").addClass("btn-primary");
            $("#message-button").removeClass("btn-primary");
            $("#message-button").addClass("btn-default");
        } else {
            $("#content-information").hide();
            $("#content-message").show();
            $("#information-button").removeClass("btn-primary");
            $("#information-button").addClass("btn-default");
            $("#message-button").addClass("btn-primary");
        }
    }

    changeStatusApprovalReviewBooking(id){
        if(confirm(this.app.trans("Are you sure to change status"))) {
            this.app.post('booking_reviews/approval', {
                review_id : id,
            }).then(res => {
                if (res.status == 200) {
                    this.route.params.subscribe((params) =>
                    {
                        if (params['id'])
                        {
                            this.fb.isNew = false;
                            this.fb.bindData('bookings/detail',{id:params['id']});
                        }
                    });
                    alert(this.app.trans("You have successfully changed your status"));
                }
            });
        } else {
            //Nothing
        }
    }

    changeStatusNonApproveReviewBooking(id){
        this.review = $('#user_comment').val();
            this.app.post('booking_reviews/reject', {
                review_id : id,
                user_comment : this.review
            }).then(res => {
                if (res.status == 200) {
                    this.route.params.subscribe((params) =>
                    {
                        if (params['id'])
                        {
                            this.fb.isNew = false;
                            this.fb.bindData('bookings/detail',{id:params['id']});
                        }
                    });
                    alert(this.app.trans("You have successfully changed your status"));
                }
            });
    }

    changeStatus(valueKey,column , model, valueColumnChange) {
        if(confirm(this.app.trans("Are you sure to change status"))) {
            this.app.post('updateFieldBackend', {
                valueKey: valueKey,
                column: column,
                model: model,
                valueColumnChange: valueColumnChange
            }).then(res => {
                if (res.status == 200) {
                    this.fb.form.value.status = parseInt(valueColumnChange);
                    console.log(this.fb.form.value.status);
                }
            });
        } else {
            //Nothing
        }
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