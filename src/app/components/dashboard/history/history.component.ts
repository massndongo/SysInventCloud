import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit{
  token!: any;
  errorMsg!: string;
  stocks!: any[];
  constructor(
    private inventoryService: InventoryService
  ) {}
  ngOnInit(): void {
    this.token = this.inventoryService.getToken();
    this.loadHistory();
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
}
