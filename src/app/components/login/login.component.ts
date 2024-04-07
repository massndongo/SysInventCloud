import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage!: string;
  formSubmitted!: boolean;
  cities!: City[];

  selectedCity!: City;
  constructor(
    private fb: FormBuilder,
    // private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cities = [
      { name: 'Boutique 1', code: 'NY' },
      { name: 'Boutique 2', code: 'RM' },
      { name: 'Boutique 3', code: 'LDN' },
      { name: 'Boutique 4', code: 'IST' },
      { name: 'Boutique 5', code: 'PRS' },
    ];
    this.formSubmitted = false;
    this.loginForm = this.fb.group({
      Login: ['', Validators.required],
      Password: ['', Validators.required],
    });
  }

  onLogin(): void {
    this.formSubmitted = true;

    if (this.loginForm.valid) {
      this.router.navigate(['/menu']);
    }
  }

  get login() {
    return this.loginForm.get('Login');
  }
  get password() {
    return this.loginForm.get('Password');
  }
}
