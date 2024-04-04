import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage!: string;
  formSubmitted!: boolean;
  constructor(
    private fb: FormBuilder,
    // private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formSubmitted = false;
    this.loginForm = this.fb.group({
      Login: ['', Validators.required],
      Password: ['', Validators.required],
    });
  }

  onLogin(): void {
    this.formSubmitted = true;
    console.log(this.loginForm);

    if (this.loginForm.valid) {
      this.router.navigate(['/liste-inventaire']);
    }
  }

  get login() {
    return this.loginForm.get('Login');
  }
  get password() {
    return this.loginForm.get('Password');
  }
}
