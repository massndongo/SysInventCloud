import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit{
  token!: any;
  errorMsg!: string;
  isSubmit!: boolean;
  stocks!: any[];
  selectedStock!:any;
  compareForm!: FormGroup;
  visible: boolean = false;
  data!: any
  infos!: boolean;

  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {}
  ngOnInit(): void {
    this.infos = false
    this.token = this.inventoryService.getToken();
    this.loadHistory();
    this.compareForm = this.fb.group({
      label: ['', Validators.required]
    })
  }
  showDialog(event: any) {
      this.visible = true;
      this.selectedStock = event.data;

  }

  loadHistory(){
    this.inventoryService.HistoryList('SYSINVENT_HISTORIQUE_INVENTAIRE', this.token)
      .subscribe({
        next: (resposne) => {
          if (resposne.OK === 1) {
            this.stocks = resposne.Contenue
          }
          else if (resposne.OK === 0) {
            this.errorMsg = resposne.TxErreur
          }
        },
        error: (error) => {
          this.errorMsg = error.error.TxErreur
        },

      })
  }
get label(){
  return this.compareForm.get('label')
}
  onCompare(){
    this.isSubmit = true;
    this.inventoryService.compare('SYSINVENT_COMPARE', this.selectedStock.LABEL, this.token)
      .subscribe({
        next: (response) => {
          if (response.OK === 1) {
            this.data = response.Contenue;
            this.visible = false;
            this.infos = true
          }
          else if(response.OK === 0){
            this.toastrService.error(response.TxErreur, '', {timeOut: 10000});
            this.visible = false;
            this.infos = false
          }
        },
        error: (error) => {
          this.toastrService.error(error.error.TxErreur, '', {timeOut: 10000});
          this.visible = false;
          this.infos = false
        }
      })
  }

  onRowSelect(event: any) {
}

onRowUnselect(event: any) {
}
}
