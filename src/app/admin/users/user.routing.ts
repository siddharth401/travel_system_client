import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { ViewComponent } from "./view.component";
import { FormComponent } from "./form.component";

export const UserRouters: Routes =
[
    {
        path: '',
        data:
        {
            pageTitle: 'Home'
        },
        children:
        [
            { path: '', redirectTo:'list' },
            { path: 'list', component: ListComponent },
            { path: 'form', component: FormComponent},
            { path: 'form/:id', component: FormComponent},
            { path: ':id', component: ViewComponent},
        ]
    },
    
];

export const UserRouting = RouterModule.forChild(UserRouters);

