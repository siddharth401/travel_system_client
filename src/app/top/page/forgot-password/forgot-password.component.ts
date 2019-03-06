import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from "../../../shared/app.service";

@Component({
    selector: 'top-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls:['./forgot-password.component.css']
})
export class TopForgotPasswordComponent implements OnInit {
    private error = {};
    private data = {'password' : '', 'extra_token': ''};
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private app: AppService
    ) { }

    ngOnInit()
    {
        $(".toggle-password").click(function() {
            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });
    }

    updatePassword(){
        this.data.password = $('.password').val();
        this.data.extra_token = this.route.snapshot.paramMap.get('extra_token') ? this.route.snapshot.paramMap.get('extra_token') : '';
        this.app.post('members/updatePassword', this.data).then(res => {
            if(res.status == 200){
                this.app.delConfig('CURRENT_MEMBER');
                this.app.delConfig('TOP_TOKEN');
                this.router.navigate(['/']);
            } else {
                this.error = res.json();
            }
        });
    }

    btnClose(){
        this.router.navigate(["/"]);
    }
}
