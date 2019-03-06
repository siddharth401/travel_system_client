import { Routes,RouterModule } from '@angular/router';
import { TestTypeFormComponent } from './test-type-form.component';
import { TestTypeListComponent } from 'app/admin/test/test-type/test-type-list.component';

export const TestTypeRouters: Routes = [
  {
    path: '',
    children: [
      { path: '', component: TestTypeListComponent },
      { path: 'form', component: TestTypeFormComponent },
      { path: 'form/:id', component: TestTypeFormComponent },
      { path: '**', redirectTo: '' }
    ]
  }

];

export const TestTypeRouting = RouterModule.forChild(TestTypeRouters);