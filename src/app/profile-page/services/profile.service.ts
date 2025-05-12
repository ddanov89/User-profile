import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Profile } from '../types/profile.type';
import { api } from '../../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  api = api;
  constructor(private http: HttpClient) {}

  getUserInformation() {
    return this.http.get<Profile>(`${api}/users`);
  }
}
