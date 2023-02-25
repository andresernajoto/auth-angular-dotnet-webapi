import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token.api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7163/api/user/'
  private userPayload: any

  constructor(private http: HttpClient, private router: Router) { 
    this.userPayload = this.decodedToken()
  }

  signUp(userObj:any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj)
  }

  login(loginObj:any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj)
  }

  signOut() {
    localStorage.clear()
    this.router.navigate(['login'])
  }

  storeToken(tokenValue:string) {
    localStorage.setItem('token', tokenValue)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue)
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') // converts to a boolean
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService()
    const token = this.getToken()!

    console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token)
  }

  getFullNameFromToken() { if (this.userPayload) { return this.userPayload.name } }

  getRoleFromToken() { if (this.userPayload) { return this.userPayload.role } }

  renewToken(tokenApi: TokenApiModel) {
    return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi)
  }
}
