import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from 'src/app/services/inventory.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage!: string;
  formSubmitted!: boolean;
  shops!: any[];
  selectedShop: any;
  msgError: any;
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadShop();
    this.formSubmitted = false;
    this.loginForm = this.fb.group({
      Login: ['', Validators.required],
      Password: ['', Validators.required],
    });
  }

  onLogin(): void {
    this.formSubmitted = true;
    localStorage.setItem('MODEINVENTAIRE', this.selectedShop.MODEINVENTAIRE);
    localStorage.setItem('NOMBOUTIQUE', this.selectedShop.Nom);

    if (this.loginForm.valid) {
      const val = this.loginForm.value;
      this.inventoryService.login(val.Login, val.Password, this.selectedShop.id).subscribe({
        next: (response) => {
          if (response.OK === 0) {
            this.errorMessage = response.Extra;
          }
          else{
            if (this.selectedShop.MODEINVENTAIRE === '1') {
              this.router.navigate(['/menu/reinitialiser']);

            }
            if (this.selectedShop.MODEINVENTAIRE === '0') {
              this.router.navigate(['/menu/initialiser']);
            }
          }
        },
        error: (error) => {
          this.errorMessage = error.error.TxErreur
        }
      })

    }
  }
  loadShop(){
    this.inventoryService.shopList('LISTE_BOUTIQUE').subscribe({
      next: (response) => {
        this.shops = response.Contenue
      }
    })
  }

  get login() {
    return this.loginForm.get('Login');
  }
  get password() {
    return this.loginForm.get('Password');
  }
}
