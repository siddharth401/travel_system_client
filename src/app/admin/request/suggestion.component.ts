import { Component, OnInit } from '@angular/core';
import { AppService } from '../../shared/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormData } from '../../shared/form-data';


@Component({
    selector: 'suggestion-form',
    templateUrl: './suggestion.component.html',
    styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnInit {
    private fb;
    private data =
    {
        id: '',
        created_at: '',
        member_id: '',
        date_plan: '',
        time_start: '',
        status: '',
        requests: {},
        plan_translates: [],
        histories: [],
        chats: []
    };
    private listMembers = {};
    private listGuiders = {};
    private listUsers = {};
    private listCountries = {};
    private listLanguages = {};

    constructor(private app: AppService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit()
    {
        this.fb = new FormData(this.app, this.data);

        this.route.params.subscribe((params) =>
        {
            if (params['id'])
            {
                this.fb.isNew = false;
                this.fb.bindData('requests/plan_detail',{id:params['id']});
                console.log(this.fb.form.value);
            }
        });
        this.getListGuiders();
        this.getListMembers();
        this.getListCountries();
        this.getLisLanguages();
    }

    getListMembers()
    {
        this.app.get('members').then(res =>
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
                this.listLanguages = this.app.arrToList(res.json().data, 'id','name');
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

}