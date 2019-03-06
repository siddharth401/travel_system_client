import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestRouting } from './test.routing';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TestFormComponent } from './test-form.component';
import { TestListComponent } from './test-list.component';

@NgModule({
  imports: [
    CommonModule,
    TestRouting,
    SmartadminModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    TestListComponent,
    TestFormComponent
  ]
})
export class TestModule { }
