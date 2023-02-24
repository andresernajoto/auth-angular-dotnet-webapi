import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public users:any = []
  
  constructor(private auth: AuthService, private api: ApiService, private toast: NgToastService) { }

  ngOnInit() {
    this.api.getUsers().subscribe(res => {
      this.users = res
    })
  }
  
  logOut() {
    this.auth.signOut()
    this.toast.success({ detail: 'SUCCESS', summary: 'User logged out successfully!' })
  }
  
}
