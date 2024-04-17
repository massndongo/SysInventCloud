import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { InventoryService } from 'src/app/services/inventory.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PickList } from 'primeng/picklist';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.scss'],
})
export class ListInventoryComponent {

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

  constructor(
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
      });
      this.movedItem = event.items[0];
    }

    this.clearSearch();
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
  }
  clearSearch() {
    console.log('test');

    if (this.pickList) {
      const filterInput = this.pickList.el.nativeElement.querySelector('.p-picklist-filter-input');

      if (filterInput) {
        filterInput.value = ' ';
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
        // this.cdr.markForCheck();
      }
    })
  }
  openCategoryPopup(product: any) {
    this.selectedProduct = product;
  }
  allToSource(): void{
    
  }
  onUpdate() {
    this.isSubmit = true;
    const valForm = this.updateForm.value;
    this.inventoryService.updateStock('SYSINVENT_SAVE_ARTICLE', this.selectedProduct.ID, valForm.CARTON, valForm.PIECE, this.token)
      .subscribe({
        next: (response) => {
          if (response.OK === 1) {
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
            this.errorMsg = response.TxErreur
            this.taostsService.error(this.errorMsg, '', {timeOut: 10000})
          }
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


  cancel() {
    if (this.movedItem  && !this.isSubmit &&  this.movedItem) {
      this.returnItemToSource(this.movedItem); // Déplacez l'élément de la cible vers la source
      this.movedItem = null; // Remettez la variable temporaire à null
    }
    this.visible = false;
  }

  returnItemToSource(product: any) {
    const index = this.targetProducts.findIndex(
      (item) => item === product
    );
    if (index !== -1) {
      this.sourceProducts.push(this.targetProducts[index]);
      this.targetProducts.splice(index, 1);
    }
  }
}
