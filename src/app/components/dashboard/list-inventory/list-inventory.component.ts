import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { InventoryService } from 'src/app/services/inventory.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PickList } from 'primeng/picklist';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.scss'],
})
export class ListInventoryComponent {
  Designation!: string;

  @ViewChild('pickList', { static: false }) pickList!: PickList;
  sourceProducts!: any[];
  targetProducts!: any[];
  selectedProduct: any | null = null;
  newCategory: string = '';
  token!: any;
  updateForm!: FormGroup;
  isSubmit!: boolean;
  visible: boolean = false;
  errorMsg!: string
  disbale = false;
  private movedItem: any | null = null;
  loading!: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private taostsService: ToastrService,
    private renderer: Renderer2, private elementRef: ElementRef,
    private primengConfig: PrimeNGConfig,
  ) {}
  onItemMoved(event: any) {
    if (event.items && event.items.length > 0) {
      this.visible = true;
      this.updateForm.patchValue({
        CARTON: this.selectedProduct.STOCK,
        PIECE: this.selectedProduct.STOCKDETAIL
      });
      this.movedItem = event.items[0];
    }
  }
  onItemMovedToSource(event: any){
    this.clearSearch();
    if (event.items && event.items.length > 0) {
      this.selectedProduct = event.items[0];
      this.inventoryService.cancelUpdateSTock('SYSINVENT_CANCELSAVE_ARTICLE', this.selectedProduct.ID, this.token)
        .subscribe({
          next: (response) => {
            if (response.OK === 1) {
              this.errorMsg = response.Autres
              this.taostsService.success(this.errorMsg, '', {timeOut: 10000})
              // this.loadStock();
            } else if (response.OK === 0) {
              this.errorMsg = response.TxErreur
              this.taostsService.error(this.errorMsg, '', {timeOut: 10000})
            }
          },
          error: (error) => {
            this.errorMsg = error.error.TxErreur
            this.taostsService.error(this.errorMsg, '', {timeOut: 10000})
          },
        })
    }
  }
  ngOnInit() {
    // Désactiver les boutons de déplacement de tous les éléments dans la liste source
    this.updateForm = this.fb.group({
      CARTON: ['', Validators.required],
      PIECE: ['', Validators.required]
    })
    this.token = this.inventoryService.getToken();
    this.loadStock();
    this.primengConfig.ripple = true;
  }
  clearSearch() {
    if (this.pickList) {
      const filterInput = this.pickList.el.nativeElement.querySelector('.p-picklist-filter-input');

      if (filterInput) {
        filterInput.value = '';
        this.updateSourceFromTarget();
      }
    }
  }
  showDialog() {
    if (this.selectedProduct) {
      this.visible = true;
    }
  }
  loadStock(){
    this.inventoryService.stockList('SYSINVENT_LISTE_ARTILCE', this.token).subscribe({
      next: (response) => {
        this.sourceProducts = response.Contenue.NON_INVENTORIE;
        this.targetProducts = response.Contenue.INVENTORIE;
        this.cdr.markForCheck();
      }
    })
  }
  openCategoryPopup(product: any) {
    this.selectedProduct = product;
  }
  allToSource(event: any){
    return []
  }
  onUpdate() {
    this.isSubmit = true;
    this.loading = true;
    const valForm = this.updateForm.value;
    this.inventoryService.updateStock('SYSINVENT_SAVE_ARTICLE', this.selectedProduct.ID, valForm.CARTON, valForm.PIECE, this.token)
      .subscribe({
        next: (response) => {
          if (response.OK === 1) {
            this.loading = false;
            this.errorMsg = response.Autres;
            this.taostsService.success(this.errorMsg, '', {timeOut: 10000});
            this.sourceProducts = [...this.sourceProducts];
            this.targetProducts.forEach(product => {
              if (product.ID === this.selectedProduct.ID) {
                product.STOCK = valForm.CARTON;
                product.STOCKDETAIL = valForm.PIECE;
              }
            });
            this.visible = false;

          } else if (response.OK === 0) {
            this.loading = false;
            this.errorMsg = response.TxErreur
            this.taostsService.error(this.errorMsg, '', {timeOut: 10000})
            this.sourceProducts = [...this.sourceProducts];
            this.cancel()
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMsg = error.error.TxErreur;
          this.visible = false;
          this.taostsService.error("Erreur Connexion. Le produit n'est pas inventorié. Veuillez Recharger la page", '', {timeOut: 10000});
          if (this.movedItem  && this.isSubmit) {
            this.returnItemToSource(this.movedItem); // Déplacez l'élément de la cible vers la source
            this.movedItem = null; // Remettez la variable temporaire à null
            this.sourceProducts = [...this.sourceProducts];
          }
          this.visible = false;
          // this.cancel();
          // this.targetProducts = [...this.targetProducts];
        }
      })
    // if (
    //   this.selectedProduct &&
    //   this.selectedProduct.id &&
    //   this.newCategory.trim() !== ''
    // ) {
    //   this.carService.updateCategory(this.selectedProduct.id, this.newCategory);
    //   this.updateCategoryInTarget(this.selectedProduct.id, this.newCategory);
    //   this.selectedProduct = null;
    //   this.newCategory = '';
    //   this.visible = false;
    // }
  }




  updateSourceFromTarget() {
    this.sourceProducts = [...this.sourceProducts];
    this.targetProducts = [...this.targetProducts];
    this.cdr.detectChanges();

  }

  cancel() {
    if (this.movedItem && !this.isSubmit) {
      this.returnItemToSource(this.movedItem);
      this.movedItem = null;
      if (this.pickList) {
        const filterInput = this.pickList.el.nativeElement.querySelector('.p-picklist-filter-input');

        if (filterInput) {
          filterInput.value = '';
          this.updateSourceFromTarget();
        }
      }
      this.sourceProducts = [...this.sourceProducts];
    }
    this.visible = false;
    this.updateSourceFromTarget();


  }

  returnItemToSource(product: any) {
    const index = this.targetProducts.findIndex(
      (item) => item === product
    );
    if (index !== -1) {
      this.sourceProducts.unshift(this.targetProducts[index]);
      this.targetProducts.splice(index, 1);
    }
  }

}
