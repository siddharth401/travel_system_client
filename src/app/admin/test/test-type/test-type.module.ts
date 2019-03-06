import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestTypeRouting } from './test-type.routing';
import { SmartadminModule } from '../../shared/smartadmin.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TestTypeFormComponent} from './test-type-form.component';
import { TestTypeListComponent} from './test-type-list.component';

@NgModule({
  imports: [
    CommonModule,
    TestTypeRouting,
    SmartadminModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    TestTypeListComponent,
    TestTypeFormComponent
  ]
})
export class TestTypeModule { }
