import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validate.form';

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

  constructor(private formBuilder: FormBuilder) { }

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

  onSubmit() {
    if (this.loginForm.valid) {
      // send data to db
      console.log(this.loginForm.value)

    } else {
      // throw error and show toastr
      ValidateForm.validateAllFormFields(this.loginForm)
      alert('Your form is invalid!')
    }
  }
}
