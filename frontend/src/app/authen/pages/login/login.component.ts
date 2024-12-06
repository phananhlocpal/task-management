import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from '../../../core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthenService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const email = this.loginForm.value.email;
            const password = this.loginForm.value.password;

            // Start loading
            this.isLoading = true;

            // Gọi API để đăng nhập
            this.authService.login({ email, password }).subscribe(
                (response) => {
                    // Sau khi đăng nhập thành công, lấy URL trước đó để chuyển hướng
                    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigate([returnUrl]);
                    
                    this.isLoading = false;
                },
                (error) => {
                    console.error('Login failed', error);
                }
            );
        }
    }

    goToRegister() {
        this.router.navigate(['auth/signup']);
    }
}
