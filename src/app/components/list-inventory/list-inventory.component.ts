import { ChangeDetectorRef, Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CategoryPopupComponent } from '../shared/category-popup/category-popup.component';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.scss'],
})
export class ListInventoryComponent {
  sourceProducts!: Product[];
  targetProducts!: Product[];
  selectedProduct: Product | null = null;
  newCategory: string = '';

  visible: boolean = false;

  constructor(
    private carService: ProductService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}
  onItemMoved(event: any) {
    // Vérifiez si l'événement contient l'élément déplacé
    if (event.items && event.items.length > 0) {
      this.visible = true;

      // Ouvrez le popup pour modifier la catégorie
      this.openCategoryPopup(event.items[0]);
    }
  }
  ngOnInit() {
    this.carService.getProductsSmall().then((products) => {
      this.sourceProducts = products;
      this.cdr.markForCheck();
    });
    this.targetProducts = [];
  }

  showDialog() {
    if (this.selectedProduct) {
      this.visible = true;
    }
  }

  openCategoryPopup(product: Product) {
    this.selectedProduct = product;
  }

  submitCategory() {
    if (
      this.selectedProduct &&
      this.selectedProduct.id &&
      this.newCategory.trim() !== ''
    ) {
      this.carService.updateCategory(this.selectedProduct.id, this.newCategory);
      this.updateCategoryInTarget(this.selectedProduct.id, this.newCategory);
      this.selectedProduct = null;
      this.newCategory = '';
      this.visible = false;
    }
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
