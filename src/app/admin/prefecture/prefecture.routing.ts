import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { FormComponent } from "./form.component";

export const PrefectureRouters: Routes =
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

export const PrefectureRouting = RouterModule.forChild(PrefectureRouters);

