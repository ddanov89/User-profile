import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from '../reducers/profile.reducer';

// Get the entire profile state
export const selectProfileState = createFeatureSelector<ProfileState>('profile');

// Select all users from the state
export const selectAllUsers = createSelector(selectProfileState, (state) => state.users);

// Select loading state for profiles
export const selectProfileLoading = createSelector(selectProfileState, (state) => state.loading);

// Select a user by ID
export const selectUserById = (userId: string) =>
  createSelector(selectProfileState, (state: ProfileState) =>
    state.users.find((user) => String(user.id) === userId)
  );