import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validate.form';

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
  
  constructor(private formBuilder: FormBuilder) { }

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
      // send data to db
      console.log(this.signUpForm.value)
    } else {
      // throw error and show toastr
      ValidateForm.validateAllFormFields(this.signUpForm)
      alert('Your form is invalid!')
    }
  }
}
