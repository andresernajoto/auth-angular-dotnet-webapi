import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = 'https://localhost:7163/api/user'

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>(this.baseUrl)
  }
}
