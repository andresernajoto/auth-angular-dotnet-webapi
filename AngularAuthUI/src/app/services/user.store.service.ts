import { Injectable } from '@angular/core';
import { BehaviorSubject, bufferToggle } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  // $ -> Observable
  private fullName$ = new BehaviorSubject<string>('')
  private role$ = new BehaviorSubject<string>('')

  constructor() { }

  // role getter
  public getRoleFromStore() {
    return this.role$.asObservable()
  }

  // role setter
  public setRoleFromStore(role: string) {
    return this.role$.next(role)
  }

  // fullName getter
  public getFullNameFromStore() {
    return this.fullName$.asObservable()
  }

  // fullName setter
  public setFullNameFromStore(fullName: string) {
    return this.fullName$.next(fullName)
  }
}
