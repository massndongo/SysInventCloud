import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-category-popup',
  templateUrl: './category-popup.component.html',
  styleUrls: ['./category-popup.component.scss'],
})
export class CategoryPopupComponent implements OnInit {
  @Input() product!: Product;
  newCategory: any;

  constructor(
    private dialogRef: DynamicDialogRef,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log(this.product);

    if (this.product && this.product.category) {
      this.newCategory = this.product.category;
    } else {
      console.error("Le produit est invalide ou n'a pas de catégorie définie.");
    }
  }

  saveCategory(category: string) {
    if (this.product.id) {
      this.productService.updateCategory(this.product.id, category);
      this.dialogRef.close();
    }
  }

  submitCategory() {
    // Assurez-vous que la nouvelle catégorie n'est pas vide avant de soumettre
    if (this.newCategory.trim() !== '') {
      // Mettre à jour la catégorie du produit avec la nouvelle catégorie
      if (this.product.id) {
        this.productService.updateCategory(this.product.id, this.newCategory);
        this.dialogRef.close(this.product);
      } else {
        console.error('Inexistant.');
      }
      // Fermer le popup avec le produit mis à jour
    } else {
      // Gérez le cas où la nouvelle catégorie est vide
      console.error('Veuillez saisir une nouvelle catégorie.');
      // Affichez un message à l'utilisateur, par exemple, en utilisant un composant Toast
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
