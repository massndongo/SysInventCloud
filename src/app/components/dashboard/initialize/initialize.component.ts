import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-initialize',
  templateUrl: './initialize.component.html',
  styleUrls: ['./initialize.component.scss']
})
export class InitializeComponent implements OnInit{
  form!: FormGroup;
  errorMsg!: string;
  isSubmit!: boolean;
  token!: any

  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private taostsService: ToastrService
  ) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      initPassword: ['', Validators.required]
    });

    this.token = this.inventoryService.getToken();
  }

  get password(){
    return this.form.get('initPassword')
  }
  onInitialize(){
    this.isSubmit = true;
    if (this.form.valid) {
      this.inventoryService.initialize('SYSINVENT_INITINVENTAIRE', this.form.value.initPassword, this.token)
        .subscribe({
          next: (response) => {
            if (response.OK === 1) {
              this.taostsService.success(this.errorMsg)
            } else if(response.OK === 0){
              this.errorMsg = response.TxErreur
              this.taostsService.error(this.errorMsg)
            }
          },
          error: (error) => {
            this.errorMsg = error.error.TxErreur
            this.taostsService.error(this.errorMsg)
          }
        })
    }
  }
}
