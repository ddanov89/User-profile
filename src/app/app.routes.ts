import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  
  {
    path: 'profile-page/:userId',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then(
        (c) => c.ProfilePageComponent
      ),
  },
];
