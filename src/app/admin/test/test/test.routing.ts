import { Routes, RouterModule } from '@angular/router';
import { TestFormComponent } from './test-form.component';
import { TestListComponent } from 'app/admin/test/test/test-list.component';

export const TestRouters: Routes =
[
  {
    path: '',
    children: [
      { path: '', component: TestListComponent },
      { path: 'form', component: TestFormComponent },
      { path: 'form/:id', component: TestFormComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];

export const TestRouting = RouterModule.forChild(TestRouters);