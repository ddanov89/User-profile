import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { profileReducer } from './state/reducers/profile.reducer';
import { ProfileEffects } from './state/effects/profile.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideStore({ profile: profileReducer }),
    provideEffects([ProfileEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideZoneChangeDetection()
  ],
};
