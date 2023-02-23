import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private auth: AuthService, private toast: NgToastService) { }

  ngOnInit() {

  }
  
  logOut() {
    this.auth.signOut()
    this.toast.success({ detail: 'SUCCESS', summary: 'User logged out successfully!' })
  }
  
}
