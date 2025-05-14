import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../types/profile.type';
import { api } from '../../constants/api.constants';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  api = api;

  constructor(private http: HttpClient) {}

   getUsers(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${api}/users`);
  }

  getUserById(userId: string): Observable<Profile> {
    return this.http.get<Profile>(`${api}/users/${userId}`);
  }

  updateUser(userId: string, payload: Partial<Profile>): Observable<Profile> {
    return this.http.put<Profile>(`${api}/users/${userId}`, payload);
  }
}