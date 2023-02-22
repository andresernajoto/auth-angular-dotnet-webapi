import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validate.form';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  type: string = 'password'
  isText: boolean = false
  eyeIcon: string = 'bi-eye-slash'
  loginForm!: FormGroup

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router, private toast: NgToastService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText
    this.isText ? this.eyeIcon = 'bi-eye-fill' : this.eyeIcon = 'bi-eye-slash'
    this.isText ? this.type = 'text' : this.type = 'password'
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: res => {
          this.loginForm.reset()
          this.toast.success({ detail: 'SUCCESS', summary: res.message, duration: 5000 })
          this.router.navigate(['dashboard'])
        },
        error: err => {
          this.toast.error({ detail: 'ERROR', summary: 'Something went wrong!', duration: 5000 })
        }
      })

    } else {
      // throw error and show toastr
      ValidateForm.validateAllFormFields(this.loginForm)
      alert('Your form is invalid!')
    }
  }
}
