import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PaginateComponent} from "./paginate.component";
import { PaginateService } from './paginate.service';

@NgModule({
  imports: [CommonModule],
  declarations: [PaginateComponent],
  providers: [PaginateService],
  exports: [PaginateComponent],
})
export class PaginateModule {}
