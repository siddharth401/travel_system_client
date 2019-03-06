import {NgModule}             from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainLayoutComponent} from "./shared/layout/app-layouts/main-layout.component";
import {AuthLayoutComponent} from "./shared/layout/app-layouts/auth-layout.component";
import {AuthGuard} from "../shared/guards/auth-guard";

const adminRoutes: Routes =
[
  {
    path: '',
    canActivateChild: [AuthGuard],
    component: MainLayoutComponent,
    children:
    [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: 'app/admin/home/home.module#HomeModule' },
      { path: 'user', loadChildren: 'app/admin/users/user.module#UserModule' },
      { path: 'password', loadChildren: 'app/admin/users/password/password.module#PasswordModule' },
      { path: 'profile', loadChildren: 'app/admin/users/profile/profile.module#ProfileModule' },
      { path: 'category', loadChildren: 'app/admin/category/category.module#CategoryModule' },
      { path: 'tmp-test-type', loadChildren: 'app/admin/test/test-type/test-type.module#TestTypeModule' },
      { path: 'tmp-test-type/**', redirectTo: 'tmp-test-type' },
      { path: 'tmp-test', loadChildren: 'app/admin/test/test/test.module#TestModule' },
      { path: 'tmp-test/**', redirectTo: 'tmp-test' },

      //language
      { path: 'language', loadChildren: 'app/admin/language/language.module#LanguageModule' },
      { path: 'language/**', redirectTo: 'language' },
      //country
      { path: 'country', loadChildren: 'app/admin/country/country.module#CountryModule' },
      { path: 'country/**', redirectTo: 'country' },
      //prefecture
      { path: 'prefecture', loadChildren: 'app/admin/prefecture/prefecture.module#PrefectureModule' },
      { path: 'prefecture/**', redirectTo: 'prefecture' },
      //city
      { path: 'city', loadChildren: 'app/admin/city/city.module#CityModule' },
      { path: 'city/**', redirectTo: 'city' },
      //
      { path: 'plan', loadChildren: 'app/admin/plan/plan.module#PlanModule' },
      { path: 'plan/**', redirectTo: 'plan' },
      //comission
      { path: 'commission', loadChildren: 'app/admin/commission/commission.module#CommissionModule' },
      { path: 'commission/**', redirectTo: 'commission' },
      //member
      { path: 'members', loadChildren: 'app/admin/member/member.module#MemberModule' },
      //booking
      { path: 'booking', loadChildren: 'app/admin/booking/booking.module#BookingModule' },
      { path: 'booking/**', redirectTo: 'booking' },
      //request
      { path: 'requests', loadChildren: 'app/admin/request/request.module#RequestModule' },
      { path: 'requests/**', redirectTo: 'request' },

    ]
  },
  { path: 'auth', component: AuthLayoutComponent, loadChildren: 'app/admin/auth/auth.module#AuthModule'},
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {}
