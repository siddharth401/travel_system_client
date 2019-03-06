import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from "./list.component";
import { FormComponent } from "./form.component";
import {SettingComponent} from "../calendar/setting.component";

export const PlanRouters: Routes =
    [
        {
            path: '',
            data:
                {
                    pageTitle: 'Plan'
                },
            children:
                [
                    { path: 'list', component: ListComponent },
                    { path: 'form', component: FormComponent},
                    { path: 'form/:id/:language_id', component: FormComponent},
                    { path: 'form/:id/:language_id/:calender', component: SettingComponent},
                    { path: '**', redirectTo: 'list' }

                ]


        },

    ];

export const PlanRouting = RouterModule.forChild(PlanRouters);

