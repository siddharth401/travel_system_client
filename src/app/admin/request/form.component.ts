import {Component, OnInit} from '@angular/core';
import {AppService} from '../../shared/app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormData} from '../../shared/form-data';


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
        member_id: '',
        country_id: '',
        city_id: '',
        category_id: '',
        desire_price: '',
        desire_price_unit: '',
        language_id: '',
        desc: '',
        num_suggestions: '',
        num_comments: '',
        status: '',
        num_people: '',
        plan_hour: '',
        rating: '',
        date_plan: '',
        time_start: '',
        date_end: '',
        title: '',
        deleted_at: '',
        members: {},
        language_support: {},
        category_translates: [],
        plans: [],
        date_deadline_suggestion: '',
        city: {},
        countries: {}
    };
    private listMembers = {};
    private listGuiders = {};
    private listUsers = {};
    private listCountries = {};
    private listPrefectures = {};
    private listCities = {};
    private params = {'id': '', 'date_end': '', 'status': 1, 'form_complete': true};
    private listStatus = {
        1: 'Published',
        2: 'Pending negotiation',
        3: 'Confirmed',
        4: 'Timed out',
        5: 'Completed activity'
    };

    constructor(private app:AppService,
                private route:ActivatedRoute,
                private router:Router) {
    }

    ngOnInit() {
        window.scrollTo(0,0);
        this.fb = new FormData(this.app, this.data);

        this.route.params.subscribe((params) => {
            if (params['id']) {
                this.fb.isNew = false;
                this.fb.bindData('requests/detail', {id: params['id'], language_id: this.app.backend_language_id});
            }
        });
        this.getListGuiders();
        this.getListMembers();

        System.import('script-loader!jquery-ui-npm/jquery-ui.min.js').then(()=>{
            $(document).ready(function(){
                $( ".datepicker" ).datepicker(
                    { dateFormat: 'yy/mm/dd' }
                );
            });
        });
    }

    registerRequest() {
        this.params['id'] = $('[name="id"]').val();
        this.params['date_end'] = $('[name="date_end"]').val();
        this.params['status'] = $('[name="status"]').val();

        this.app.post('requests/save', this.params).then(res => {
            if (res.status == 200) {
                this.router.navigate(['admin/requests']);
            }
        });
    }

    getListMembers() {
        this.app.get('members').then(res => {
            if (res.status == 200) {
                this.listMembers = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    getListGuiders() {
        this.app.get('members', {'type': 2}).then(res => {
            if (res.status == 200) {
                this.listGuiders = this.app.arrToList(res.json().data, 'id', 'name');
            }
        });
    }

    getListUsers() {
        this.app.get('users').then(res => {
            if (res.status == 200) {
                this.listUsers = this.app.arrToList(res.json().data, 'id', 'username');
            }
        });
    }

    getListPrefectures() {
        this.app.get('prefectures').then(res => {
            if (res.status == 200) {
                this.listPrefectures = this.app.arrToList(res.json().data, 'id', 'display_name');
            }
        });
    }

    changeStatus(valueKey, column, model, valueColumnChange) {
        if(confirm(this.app.trans("Are you sure to change status?"))) {
            this.app.post('updateFieldBackend', {
                valueKey: valueKey,
                column: column,
                model: model,
                valueColumnChange: valueColumnChange
            }).then(res => {
                if (res.status == 200) {
                    this.fb.form.value.status = parseInt(valueColumnChange);
                }
            });
        }
    }

}