import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminActiveComponent } from './sa-active.component';
import { FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule, FormsModule
  ],
  declarations: [AdminActiveComponent],
  exports: [AdminActiveComponent]
})
export class AdminActiveModule { }