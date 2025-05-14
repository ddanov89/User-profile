import { createAction, props } from "@ngrx/store";
import { Profile } from "../../profile-page/types/profile.type";

export const loadUsers = createAction('[Profile] Load Users');
export const loadUsersSuccess = createAction('[Profile] Load Users Success', props<{ users: Profile[] }>());
export const loadUsersFailure = createAction('[Profile] Load Users Failure', props<{ error: any }>());

export const updateUser = createAction('[Profile] Update User', props<{ userId: string, data: Partial<Profile> }>());
export const updateUserSuccess = createAction('[Profile] Update User Success', props<{ user: Profile }>());
export const updateUserFailure = createAction('[Profile] Update User Failure', props<{ error: any }>());
