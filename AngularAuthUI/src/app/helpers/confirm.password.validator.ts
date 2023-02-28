import { FormGroup } from "@angular/forms";

export function ConfirmPasswordValidator(controlName: string, matchControlName: string) {
    return (formGroup: FormGroup) => {
        const passwordControl = formGroup.controls[controlName]
        const confirmPassControl = formGroup.controls[matchControlName]
        
        if (confirmPassControl.errors && confirmPassControl.errors['confirmPasswordValidator']) {
            return
        }

        if (passwordControl.value !== confirmPassControl.value) {
            confirmPassControl.setErrors({ confirmPasswordValidator: true })
        } else {
            confirmPassControl.setErrors(null)
        }
    }
}