import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { FormComponent } from "./form.component";

export const CountryRouters: Routes =
    [
        {
            path: '',
            data:
                {
                    pageTitle: 'Country'
                },
            children:
                [
                    { path: '', component: ListComponent },
                    { path: 'form', component: FormComponent},
                    { path: 'form/:id', component: FormComponent},
                ]
        },

    ];

export const CountryRouting = RouterModule.forChild(CountryRouters);

