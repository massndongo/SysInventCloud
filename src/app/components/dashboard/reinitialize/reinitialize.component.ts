import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-reinitialize',
  templateUrl: './reinitialize.component.html',
  styleUrls: ['./reinitialize.component.scss']
})
export class ReinitializeComponent implements OnInit{
  form!: FormGroup;
  errorMsg!: string;
  isSubmit!: boolean;
  token!: any
  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      initPassword: ['', Validators.required]
    });

    this.token = this.inventoryService.getToken();
  }


  get password(){
    return this.form.get('initPassword')
  }
  onReinitialize(){
    this.isSubmit = true;
    if (this.form.valid) {
      this.inventoryService.initialize('SYSINVENT_RE_INITINVENTAIRE', this.form.value.initPassword, this.token)
        .subscribe({
          next: (response) => {
            if (response.OK === 1) {

            } else if(response.OK === 0){
              this.errorMsg = response.TxErreur
            }
          },
          error: (error) => {
            this.errorMsg = error.error.TxErreur
          }
        })
    }
  }
}
