import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validate.form';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent  implements OnInit {
  type: string = 'password'
  isText: boolean = false
  eyeIcon: string = 'bi-eye-slash'
  signUpForm!: FormGroup
  
  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router, private toast: NgToastService) { }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText
    this.isText ? this.eyeIcon = 'bi-eye-fill' : this.eyeIcon = 'bi-eye-slash'
    this.isText ? this.type = 'text' : this.type = 'password'
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      this.auth.signUp(this.signUpForm.value).subscribe({
        next: res => {
          this.signUpForm.reset()
          this.toast.success({ detail: 'SUCCESS', summary: res.message, duration: 3000 })
          this.router.navigate(['login'])
        },
        error: err => {
          this.toast.error({ detail: 'ERROR', summary: 'Something went wrong!', duration: 3000 })
        }
      })
    } else {
      // throw error and show toastr
      ValidateForm.validateAllFormFields(this.signUpForm)
      this.toast.error({ detail: 'ERROR', summary: 'Your form is invalid!', duration: 3000 })
    }
  }
}
