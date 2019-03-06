import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModule } from './login/login.module';
import { LockedComponent } from './locked/locked.component';
import { RegisterComponent } from './register/register.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ForgotCompleteComponent } from './forgot-complete/forgot-complete.component';
import { routing} from "./auth.routing";
import { AuthComponent } from './auth.component';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { LogoutComponent } from "./logout.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    LoginModule
  ],
  declarations:
  [
      LogoutComponent, LockedComponent,
      RegisterComponent, ForgotComponent, AuthComponent, ForgotCompleteComponent
  ],
  providers : []
})
export class AuthModule { }
