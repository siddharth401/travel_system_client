import { Routes, RouterModule } from '@angular/router';
import {MemberComponent} from "./member.component";
import {MemberAddComponent} from "./member-add/member-add.component";
import {MemberAddCompletionComponent} from "./member-add/completion/completion.component";
import {MemberLoginComponent} from "./member-login/member-login.component";
import {MemberLogoutComponent} from "./member-logout/logout.component";
import {ReminderComponent} from "./reminder/reminder.component";
import {ReminderCompletionComponent} from "./reminder-completion/reminder-completion.component";
import {MemberLogoutAllComponent} from "./member-logout-all-device/logout-all.component";

export const memberRoutes: Routes = [
    {
        path: '',
        data: {
            pageTitle: 'Member'
        },
        children: [
        { path: '', component: MemberComponent },
        { path: 'add', component: MemberAddComponent },
        { path: 'add/completion', component: MemberAddCompletionComponent },
        { path: 'login', component: MemberLoginComponent },
        { path: 'logout', component: MemberLogoutComponent },
        { path: 'logout-all', component: MemberLogoutAllComponent },
        { path: 'login/reminder', component: ReminderComponent },
        { path: 'login/reminder/completion', component: ReminderCompletionComponent }
    ]
    }
];

export const memberRouting = RouterModule.forChild(memberRoutes);

