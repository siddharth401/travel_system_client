import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { FormComponent } from "./form.component";

export const LanguageRouters: Routes =
    [
        {
            path: '',
            data:
                {
                    pageTitle: 'Language'
                },
            children:
                [
                    { path: '', component: ListComponent },
                    { path: 'form', component: FormComponent},
                    { path: 'form/:id', component: FormComponent},
                ]
        },

    ];

export const LanguageRouting = RouterModule.forChild(LanguageRouters);

