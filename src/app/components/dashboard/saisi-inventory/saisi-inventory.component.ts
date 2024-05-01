import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-saisi-inventory',
  templateUrl: './saisi-inventory.component.html',
  styleUrls: ['./saisi-inventory.component.scss']
})
export class SaisiInventoryComponent implements OnInit{
  sourceProducts!: any[];
  filterSourceProducts!: any[];
  targetProducts!: any[];
  filterTargetProducts!: any[];
  selectedProduct: any | null = null;
  sourceFilter: string = '';
  targetFilter: string = '';
  token: any;
  nombreSource!: number;
  nombreTarget!: number;
  selectedProductSource: any;
  selectedProductTarget: any;
  @ViewChild('dt1') dt1!: Table;
  @ViewChild('dt2') dt2!: Table;
  updateForm!: FormGroup;
  visible: boolean = false;
  errorMsg!: string
  disbale = false;
  isSubmit!: boolean;
  private movedItem: any | null = null;
  loading!: boolean;
  visibleCancel!: boolean;
  loadingTable!: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private taostsService: ToastrService,
    private primengConfig: PrimeNGConfig,
  ) {}

  ngOnInit(): void {
    this.token = this.inventoryService.getToken();
    this.loadStock();
    this.updateForm = this.fb.group({
      CARTON: ['', Validators.required],
      PIECE: ['', Validators.required]
    })
  }


  loadStock(){
    this.loadingTable = true;
    this.inventoryService.stockList('SYSINVENT_LISTE_ARTILCE', this.token).subscribe({
      next: (response) => {
        if (response.OK === 1) {
          this.loadingTable = false;
          this.sourceProducts = response.Contenue.NON_INVENTORIE;
          this.filterSourceProducts = this.sourceProducts;
          this.targetProducts = response.Contenue.INVENTORIE;
          this.filterTargetProducts = this.targetProducts;
          this.nombreSource = this.sourceProducts.length;
          this.nombreTarget = this.targetProducts.length
        }
      }
    })
  }


  onItemMoved(selectedProduct: any) {
    if (selectedProduct) {
      this.visible = true;
      this.updateForm.patchValue({
        CARTON: selectedProduct.STOCK,
        PIECE: selectedProduct.STOCKDETAIL
      });
      this.movedItem = selectedProduct;
      this.selectedProduct = selectedProduct;
    }
  }

  itemMovedToSource(selectedProduct: any) {
    if (selectedProduct) {
      this.visibleCancel = true
      this.selectedProductTarget = selectedProduct;
    }
  }

  cancelUpdate(){
      this.inventoryService.cancelUpdateSTock('SYSINVENT_CANCELSAVE_ARTICLE', this.selectedProductTarget.ID, this.token)
        .subscribe({
          next: (response) => {
            if (response.OK === 1) {
              this.errorMsg = response.Autres
              this.taostsService.success(this.errorMsg, '', {timeOut: 10000})
              const index = this.targetProducts.findIndex(product => product.ID === this.selectedProductTarget.ID);
              if (index !== -1) {
                const movedProduct = this.targetProducts.splice(index, 1)[0];
                this.sourceProducts.unshift(movedProduct);
              }
              this.visibleCancel = false;
              this.targetFilter = "";
              this.nombreSource = this.sourceProducts.length;
              this.nombreTarget = this.targetProducts.length;
              this.selectedProductTarget = null;
              this.filterTarget();
            } else if (response.OK === 0) {
              this.errorMsg = response.TxErreur
              this.taostsService.error(this.errorMsg, '', {timeOut: 10000})
            }
          },
          error: (error) => {
            this.visibleCancel = false;
            this.errorMsg = error.error.TxErreur
            this.taostsService.error(this.errorMsg, '', {timeOut: 10000})
          },
        })
  }
  onUpdate() {
    this.isSubmit = true;
    this.loading = true;
    const valForm = this.updateForm.value;

    this.inventoryService.updateStock('SYSINVENT_SAVE_ARTICLE', this.movedItem.ID, valForm.CARTON, valForm.PIECE, this.token)
      .subscribe({
        next: (response) => {
          if (response.OK === 1) {
            this.loading = false;
            this.errorMsg = response.Autres;
            this.taostsService.success(this.errorMsg, '', {timeOut: 10000});
            // Mettre à jour les tableaux locaux sans rappeler loadStock
            const index = this.sourceProducts.findIndex(product => product.ID === this.movedItem.ID);
            if (index !== -1) {
              const movedProduct = this.sourceProducts.splice(index, 1)[0];
              movedProduct.STOCK = valForm.CARTON;
              movedProduct.STOCKDETAIL = valForm.PIECE;
              this.targetProducts.unshift(movedProduct);
            }

            this.sourceFilter = "";
            this.nombreSource = this.sourceProducts.length;
            this.nombreTarget = this.targetProducts.length;
            this.filterSource();
            this.selectedProductSource = null
            this.visible = false;

          } else if (response.OK === 0) {
            this.loading = false;
            this.errorMsg = response.TxErreur
            this.taostsService.error(this.errorMsg, '', {timeOut: 10000})
            this.filterSourceProducts = [...this.filterSourceProducts];
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMsg = error.error.TxErreur;
          this.visible = false;
          this.taostsService.error("Erreur Connexion. Le produit n'est pas inventorié. Veuillez Recharger la page", '', {timeOut: 10000});
          if (this.movedItem  && this.isSubmit) {
            // this.returnItemToSource(this.movedItem); // Déplacez l'élément de la cible vers la source
            this.movedItem = null; // Remettez la variable temporaire à null
            this.filterSourceProducts = [...this.filterSourceProducts];
          }
          this.visible = false;
        }
      })
  }

  // Fonction de filtrage pour la liste source
  filterSource() {
    this.filterSourceProducts = this.sourceProducts.filter((product: any) =>
      product.Designation.toLowerCase().includes(this.sourceFilter.toLowerCase())
    );
    this.dt1.reset();
  }

  // Fonction de filtrage pour la liste cible
  filterTarget() {
    this.filterTargetProducts = this.targetProducts.filter(product =>
      product.Designation.toLowerCase().includes(this.targetFilter.toLowerCase())
    );
    this.dt2.reset();
  }

}
