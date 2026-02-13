import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from './services/quiz.service';
import { ApiService } from './services/api.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'quiz',
    loadComponent: () =>
      import('./components/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: 'contract',
    loadComponent: () =>
      import('./components/contract.component').then(
        (m) => m.ContractComponent
      ),
    canActivate: [
      () => {
        const quiz = inject(QuizService);
        if (!quiz.isComplete()) {
          inject(Router).navigate(['/quiz']);
          return false;
        }
        return true;
      },
    ],
  },
  {
    path: 'sign',
    loadComponent: () =>
      import('./components/signature.component').then(
        (m) => m.SignatureComponent
      ),
    canActivate: [
      () => {
        const api = inject(ApiService);
        if (!api.contractData()) {
          inject(Router).navigate(['/contract']);
          return false;
        }
        return true;
      },
    ],
  },
  {
    path: 'done',
    loadComponent: () =>
      import('./components/done.component').then((m) => m.DoneComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin.component').then((m) => m.AdminComponent),
  },
  { path: '**', redirectTo: '' },
];
