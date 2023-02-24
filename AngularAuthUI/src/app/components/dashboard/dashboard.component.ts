import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user.store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public users:any = []
  public fullName: string = ''
  public role!: string
  
  constructor(private auth: AuthService, private api: ApiService, private toast: NgToastService, private userStore: UserStoreService) { }

  ngOnInit() {
    this.api.getUsers().subscribe(res => {
      this.users = res
    })

    this.userStore.getFullNameFromStore().subscribe(val => {
      const fullNameFromToken = this.auth.getFullNameFromToken()
      this.fullName = val || fullNameFromToken
    })

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToken()
      this.role = val || roleFromToken
    })
  }
  
  signOut() {
    this.auth.signOut()
    this.toast.success({ detail: 'SUCCESS', summary: 'User logged out successfully!', duration: 3000 })
  }
  
}
