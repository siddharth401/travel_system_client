import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from "./setting.component";

export const calendarRouters: Routes = [
  {
    path: '',
    data: {
        pageTitle: 'Setting'
    },
    children: [
      { path: '', component: SettingComponent },
    ]
  }
];

export const CalendarRouting = RouterModule.forChild(calendarRouters);

