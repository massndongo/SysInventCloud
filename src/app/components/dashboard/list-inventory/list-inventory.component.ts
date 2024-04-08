import { ChangeDetectorRef, Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CategoryPopupComponent } from '../../shared/category-popup/category-popup.component';
import { InventoryService } from 'src/app/services/inventory.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.scss'],
})
export class ListInventoryComponent {
  sourceProducts!: any[];
  targetProducts!: any[];
  selectedProduct: any | null = null;
  newCategory: string = '';
  token!: any;
  updateForm!: FormGroup;
  isSubmit!: boolean;
  visible: boolean = false;
  errorMsg!: string

  constructor(
    private carService: ProductService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private inventoryService: InventoryService,
    private fb: FormBuilder
  ) {}
  onItemMoved(event: any) {
    // Vérifiez si l'événement contient l'élément déplacé
    if (event.items && event.items.length > 0) {
      this.visible = true;
      // Ouvrez le popup pour modifier la catégorie
      this.openCategoryPopup(event.items[0]);
      this.updateForm.patchValue({
        CARTON: this.selectedProduct.STOCK,
        PIECE: this.selectedProduct.STOCKDETAIL
      })
    }
  }
  onItemMovedToSource(event: any){
    if (event.items && event.items.length > 0) {
      this.selectedProduct = event.items[0];
      this.inventoryService.cancelUpdateSTock('SYSINVENT_CANCELSAVE_ARTICLE', this.selectedProduct.ID, this.token)
        .subscribe({
          next: (response) => {
            if (response.OK === 1) {
              this.errorMsg = response.Autres
              this.ngOnInit();
            } else if (response.OK === 0) {
              this.errorMsg = response.TxErreur
            }
          },
          error: (error) => {
            this.errorMsg = error.error.TxErreur
          },
        })
    }
  }
  ngOnInit() {
    // this.carService.getProductsSmall().then((products) => {
    //   this.sourceProducts = products;
    //   this.cdr.markForCheck();
    // });
    this.updateForm = this.fb.group({
      CARTON: ['', Validators.required],
      PIECE: ['', Validators.required]
    })
    this.token = this.inventoryService.getToken();
    this.inventoryService.stockList('SYSINVENT_LISTE_ARTILCE', this.token).subscribe({
      next: (response) => {
        this.sourceProducts = response.Contenue.NON_INVENTORIE.slice(0, 10);

        this.targetProducts = response.Contenue.INVENTORIE;
        this.cdr.markForCheck();
      }
    })
  }

  showDialog() {
    if (this.selectedProduct) {
      this.visible = true;
    }
  }

  openCategoryPopup(product: any) {
    this.selectedProduct = product;
  }

  onUpdate() {

    this.isSubmit = true;
    const valForm = this.updateForm.value;
    this.inventoryService.updateStock('SYSINVENT_SAVE_ARTICLE', this.selectedProduct.ID, valForm.CARTON, valForm.PIECE, this.token)
      .subscribe({
        next: (response) => {
          if (response.OK === 1) {
            this.errorMsg = response.Autres
          } else if (response.OK === 0) {
            this.errorMsg = response.TxErreur
          }
          this.ngOnInit();
        },
        error: (error) => {
          this.errorMsg = error.error.TxErreur
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

  updateCategoryInTarget(productId: string, newCategory: string) {
    const productToUpdate = this.targetProducts.find(
      (product) => product.id === productId
    );
    if (productToUpdate) {
      productToUpdate.category = newCategory;
    } else {
      console.error(
        `Produit avec l'ID ${productId} introuvable dans la liste cible.`
      );
    }
  }

  returnItemToSource(product: Product) {
    const index = this.targetProducts.findIndex(
      (item) => item.id === product.id
    );
    if (index !== -1) {
      this.sourceProducts.push(this.targetProducts[index]);
      this.targetProducts.splice(index, 1);
    }
  }
  cancel() {
    if (this.selectedProduct) {
      this.returnItemToSource(this.selectedProduct);
      this.selectedProduct = null;
      this.newCategory = '';
    }
  }
}
