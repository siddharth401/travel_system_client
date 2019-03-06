import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { FormComponent } from "./form.component";

export const CityRouters: Routes =
    [
        {
            path: '',
            data:
                {
                    pageTitle: 'Prefecture'
                },
            children:
                [
                    { path: '', component: ListComponent },
                    { path: 'form', component: FormComponent},
                    { path: 'form/:id', component: FormComponent},
                ]
        },

    ];

export const CityRouting = RouterModule.forChild(CityRouters);

