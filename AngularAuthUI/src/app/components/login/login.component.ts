import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validate.form';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset.password.service';
import { UserStoreService } from 'src/app/services/user.store.service';

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

  public resetPasswordEmail!: string
  public isValidEmail!: boolean

  constructor(private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private resetService: ResetPasswordService) { }

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
          this.auth.storeToken(res.accessToken)
          this.auth.storeRefreshToken(res.refreshToken)

          const tokenPayload = this.auth.decodedToken()
          this.userStore.setFullNameFromStore(tokenPayload.name)
          this.userStore.setRoleFromStore(tokenPayload.role)

          this.toast.success({ detail: 'SUCCESS', summary: res.message, duration: 3000 })
          this.router.navigate(['dashboard'])
        },
        error: err => {
          this.toast.error({ detail: 'ERROR', summary: 'Something went wrong!', duration: 3000 })
        }
      })

    } else {
      // throw error and show toastr
      ValidateForm.validateAllFormFields(this.loginForm)
      this.toast.error({ detail: 'ERROR', summary: 'Your form is invalid!', duration: 3000 })
    }
  }

  checkValidEmail(event: string) {
    const val = event
    const pattern = /\S+@\S+\.\S+/
    this.isValidEmail = pattern.test(val)

    return this.isValidEmail
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) { console.log(this.resetPasswordEmail) }

    // api call
    this.resetService.sendResetPassLink(this.resetPasswordEmail).subscribe({
      next: res => {
        this.toast.success({ detail: 'SUCCESS', summary: 'Reset link sent successfully!', duration: 3000 })
        this.resetPasswordEmail = ''

        const buttonRef = document.getElementById('close-btn')
        buttonRef?.click()
      },
      error: err => {
        this.toast.error({ detail: 'ERROR', summary: 'Something went wrong', duration: 3000 })
      }
    })
  }
}
