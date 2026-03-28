import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout';
import { LoginComponent } from './features/auth/login/login';
import { TaskListComponent } from './features/tasks/task-list/task-list';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'tasks', component: TaskListComponent, canActivate: [authGuard] },
      { path: '', redirectTo: 'tasks', pathMatch: 'full' }
    ]
  }
];