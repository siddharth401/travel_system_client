import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from "./forgot_password.component";

export const PageRouters: Routes =
    [
        {
            path: '',
            data:
            {
                pageTitle: 'Page'
            },
            children:
                [
                    { path: 'forgot-password/:extra_token', component: ForgotPasswordComponent }
                ]
        },

    ];

export const PageRouting = RouterModule.forChild(PageRouters);

