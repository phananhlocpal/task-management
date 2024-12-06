import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenService } from '../../../core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-sign-up',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
    signUpForm: FormGroup;
    message: string = ''; 

    constructor(private fb: FormBuilder, private authenService: AuthenService, private router: Router,) {
        this.signUpForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            role: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    // Custom validator to check if passwords match
    passwordMatchValidator(form: FormGroup) {
        return form.get('password')?.value === form.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    onSubmit() {
        if (this.signUpForm.valid) {
            const signUpData = this.signUpForm.value;
            this.authenService.signUp({
                name: signUpData.name,
                email: signUpData.email,
                password: signUpData.password,
                role: signUpData.role
            }).subscribe(
                response => {
                    this.message = response.message || 'Registration successful. Please check your email to verify your account.';
                },
                error => {
                    this.message = error.error.message || 'Registration failed. Please try again.';
                }
            );
        }
    }

    goToLogin() {
        this.router.navigate(['auth/login']);
    }
}
