import { ChangeDetectorRef, Component, ElementRef, Renderer2 } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CategoryPopupComponent } from '../../shared/category-popup/category-popup.component';
import { InventoryService } from 'src/app/services/inventory.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  disbale = false;

  constructor(
    private carService: ProductService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private taostsService: ToastrService,
    private renderer: Renderer2, private elementRef: ElementRef
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
              this.taostsService.success(this.errorMsg, '', {timeOut: 10000})
              this.loadStock();
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
    const sourceButtons = this.elementRef.nativeElement.querySelectorAll('.ui-picklist-buttons-source button');
    sourceButtons.forEach((button: any) => {
      if (button.classList.contains('ui-picklist-buttons-all')) {
        this.renderer.setProperty(button, 'disabled', true);
      }
    });
    this.updateForm = this.fb.group({
      CARTON: ['', Validators.required],
      PIECE: ['', Validators.required]
    })
    this.token = this.inventoryService.getToken();
    this.loadStock();
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
        console.log(this.sourceProducts);

        this.targetProducts = response.Contenue.INVENTORIE;
        console.log(this.targetProducts);

        this.cdr.markForCheck();
      }
    })
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
            this.errorMsg = response.Autres;
            this.taostsService.success(this.errorMsg, '', {timeOut: 10000})
            this.loadStock();
            this.visible = false;
          } else if (response.OK === 0) {
            this.errorMsg = response.TxErreur
            this.taostsService.error(this.errorMsg, '', {timeOut: 10000})
          }
          this.ngOnInit();
        },
        error: (error) => {
          this.errorMsg = error.error.TxErreur;
          this.visible = false;
          this.taostsService.error(this.errorMsg, '', {timeOut: 10000})
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
    this.visible = false;
    this.loadStock();
  }
}
