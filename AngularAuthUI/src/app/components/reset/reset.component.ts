import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmPasswordValidator } from 'src/app/helpers/confirm.password.validator';
import ValidateForm from 'src/app/helpers/validate.form';
import { ResetPassword } from 'src/app/models/reset.password';
import { ResetPasswordService } from 'src/app/services/reset.password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  constructor(private formBuilder: FormBuilder,
    private activedRoute: ActivatedRoute,
    private toast: NgToastService,
    private resetService: ResetPasswordService,
    private router: Router) { }
  
  resetForm!: FormGroup
  emailToReset!: string
  emailToken!: string
  resetPassObj = new ResetPassword()

  typeNP: string = 'password'; typeCP: string = 'password'
  isTextNP: boolean = false; isTextCP: boolean = false
  eyeIconNP: string = 'bi-eye-slash'; eyeIconCP: string = 'bi-eye-slash'

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPass: ['', Validators.required]
    },
    {
      validator: ConfirmPasswordValidator("password", "confirmPass")
    })

    this.activedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email']
      let uriToken = val['code']

      this.emailToken = uriToken.replace(/ /g, '+')

      console.log(`Token: ${this.emailToken}\nEmail: ${this.emailToReset}`)
    })
  }

  reset() {
    if (this.resetForm.valid) {
      this.resetPassObj.email = this.emailToReset
      this.resetPassObj.newPassword = this.resetForm.value.password
      this.resetPassObj.confirmPassword = this.resetForm.value.confirmPass
      this.resetPassObj.emailToken = this.emailToken

      this.resetService.resetPassword(this.resetPassObj).subscribe({
        next: res => {
          this.toast.success({ detail: 'SUCCESS', summary: 'Password reseted successfully!', duration: 3000 })
          this.router.navigate(['login'])
        },
        error: err => {
          this.toast.error({ detail: 'ERROR', summary: 'Something gone wrong!', duration: 3000 })
        }
      })
    } else {
      ValidateForm.validateAllFormFields(this.resetForm)
      this.toast.error({ detail: 'ERROR', summary: 'Your form is invalid!', duration: 3000 })
    }
  }

  hideShowPassNP() {
    this.isTextNP = !this.isTextNP
    this.isTextNP ? this.eyeIconNP = 'bi-eye-fill' : this.eyeIconNP = 'bi-eye-slash'
    this.isTextNP ? this.typeNP = 'text' : this.typeNP = 'password'
  }

  hideShowPassCP() {
    this.isTextCP = !this.isTextCP
    this.isTextCP ? this.eyeIconCP = 'bi-eye-fill' : this.eyeIconCP = 'bi-eye-slash'
    this.isTextCP ? this.typeCP = 'text' : this.typeCP = 'password'
  }
}
