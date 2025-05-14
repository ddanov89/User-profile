import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },

  {
    path: 'profile-page/:userId',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (c) => c.ProfilePageComponent
      ),
  },
  {
    path: 'edit/:userId',
    loadComponent: () =>
      import('./edit-page/edit-page.component').then(
        (c) => c.EditPageComponent
      ),
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
