import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/questions',
    pathMatch: 'full',
  },
  {
    path: 'questions',
    loadComponent: () =>
      import('./features/question/pages/question-management/question-management.page').then(
        (m) => m.QuestionManagementPage
      ),
  },
];
