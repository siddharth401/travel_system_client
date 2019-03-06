import { Component, OnInit } from '@angular/core';
import { AppService } from "../shared/app.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot_password.component.html',
    styleUrls: [
        "./forgot_password.component.css",
        '../../assets/admin/css/bootstrap.min.css',
        '../../assets/admin/css/font-awesome.min.css',
        '../../assets/admin/css/smartadmin-production.min.css',
    ]
})

export class ForgotPasswordComponent implements OnInit
{
    private params = {'extra_token': '', 'password': '', 'password_confirmation': ''};
    private extra_token;
    private error;

    constructor
    (
        private app: AppService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit()
    {
        this.route.params.subscribe((params) =>
        {
            if (params['extra_token'])
            {
                this.extra_token = params['extra_token'];
            }
        });

    }
    submitPassword(extra_token) {
        this.params['extra_token'] = extra_token;
        this.params['password'] = $('[name="password"]').val();
        this.params['password_confirmation'] = $('[name="password_confirmation"]').val();
        this.app.post('users/resetPassword-activation', this.params).then(res => {
            if (res.status == 200) {
                alert(res.json().message);
                this.router.navigate(['admin/auth/login']);
            } else {
                this.error = res.json();
            }
        });
    }
}