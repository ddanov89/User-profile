import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../types/profile.type';
import { api } from '../../constants/api.constants';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  api = api;

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<Profile | undefined> {
    const localData = localStorage.getItem('userProfiles');
  // Check if there is user data in local storage and find the user from there
    if (localData) {
      const users: Profile[] = JSON.parse(localData);
      const user = users.find((u) => String(u.id) === String(userId));
      return of(user);
    } else {
      // Else fetch from API, store, then find user
      return this.getUsers().pipe(
        tap((users) => {
          localStorage.setItem('userProfiles', JSON.stringify(users));
        }),
        map((users) => users.find((u) => u.id === userId))
      );
    }
  }

  //   getUserById(userId: string | undefined | null) {   //this method won't be needed at this point
  //   return this.http.get<Profile>(`${api}/users/${userId}`);
  // }

  updateUser(userId: string | undefined | null, payload: {}) {
    return this.http.put<Profile>(`${api}/users/${userId}`, payload);
  }

  private getUsers() {
    return this.http.get<Profile[]>(`${api}/users`);
  }
}
