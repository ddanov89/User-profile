import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileService } from '../../profile-page/services/profile.service';
import {
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from '../actions/profile.actions';
import { catchError, defer, map, of, switchMap, tap } from 'rxjs';

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private profileService = inject(ProfileService);

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

          // Fallback to API call if no localStorage data
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
        })
      ),
    { dispatch: false } // This effect does not dispatch any further actions
  );
}
