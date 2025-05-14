import { createReducer, on } from '@ngrx/store';
import { Profile } from '../../profile-page/types/profile.type';
import {
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,
  updateUserSuccess,
} from '../actions/profile.actions';

export interface ProfileState {
  users: Profile[];
  loading: boolean;
  error: any;
}

export const initialState: ProfileState = {
  users: [],
  loading: false,
  error: null,
};

export const profileReducer = createReducer(
  initialState,
  on(loadUsers, (state) => ({ ...state, loading: true })),
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users,
  })),
  on(loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
  }))
);
