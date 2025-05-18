import { Component, OnInit } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-saisi-inventaire-light',
  templateUrl: './saisi-inventaire-light.component.html',
  styleUrls: ['./saisi-inventaire-light.component.scss'],
  
})
export class SaisiInventaireLightComponent {
  items = [
    { name: 'Produit 1' },
    { name: 'Produit 2' },
    { name: 'Produit 3' },
    // ... ajoute d'autres items ici
  ];
  filteredItems: any[] = [];
  selectedItem: any;
  constructor() {}
   ngOnInit() {
        
    }

  filterItems(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(query)
    );
  }
}
