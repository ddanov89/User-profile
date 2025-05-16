import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from '../actions/profile.actions';
import { catchError, defer, map, of, switchMap, tap } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarService } from '../../../shared/services/snackBarService';
import {
  errorMessages,
  successMessages,
} from '../../../constants/validation-messages';

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private snackBar = inject(SnackBarService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        defer(() => {
          const usersFromStorage = localStorage.getItem('users');

          if (usersFromStorage) {
            const users = JSON.parse(usersFromStorage);
            return of(loadUsersSuccess({ users }));
          }

          return this.profileService.getUsers().pipe(
            map((users) => loadUsersSuccess({ users })),
            catchError((error) => of(loadUsersFailure({ error })))
          );
        })
      )
    )
  );

  loadUsersSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadUsersSuccess),
        tap(({ users }) => {
          const existing = localStorage.getItem('users');
          if (!existing) {
            localStorage.setItem('users', JSON.stringify(users));
          }
        })
      ),
    { dispatch: false } // This effect does not dispatch another action
  );

  loadUsersFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadUsersFailure),
        tap(({ error }) =>
          this.snackBar.toggleSnackBar(errorMessages.dataLoadFail)
        )
      ),
    { dispatch: false }
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      switchMap(({ userId, data }) =>
        this.profileService.updateUser(userId, data).pipe(
          map((user) => updateUserSuccess({ user })),
          catchError((error) => of(updateUserFailure({ error })))
        )
      )
    )
  );

  // Effect to update localStorage after updating a user
  updateUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateUserSuccess),
        tap((action) => {
          // Get current users from localStorage (or use empty array if none found)
          const users = JSON.parse(localStorage.getItem('users') || '[]');

          // Find the user in the list and update it
          const updatedUsers = users.map((u: { id: string }) =>
            String(u.id) === String(action.user.id)
              ? { ...u, ...action.user }
              : u
          );

          // Save the updated users back to localStorage
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          this.snackBar.toggleSnackBar(successMessages.userUpdateSuccess);
        })
      ),
    { dispatch: false } // This effect does not dispatch any further actions
  );

  updateUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateUserFailure),
        tap(({ error }) =>
          this.snackBar.toggleSnackBar(errorMessages.userUpdateFail)
        )
      ),
    { dispatch: false }
  );

  navigateOnUpdateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateUserSuccess),
        tap(({ user }) => {
          this.router.navigate([`/profile-page/${user.id}`]);
        })
      ),
    { dispatch: false }
  );
}
