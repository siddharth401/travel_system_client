import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from "./form.component";

export const CommissionRouters: Routes =
    [
        {
            path: '',
            data:
                {
                    pageTitle: 'Commission'
                },
            children:
                [
                    { path: 'form', component: FormComponent},
                ]
        },

    ];

export const CommissionRouting = RouterModule.forChild(CommissionRouters);

