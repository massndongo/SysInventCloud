import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { InventoryService, xNotification } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-saisi-inventaire-light',
  templateUrl: './saisi-inventaire-light.component.html',
  styleUrls: ['./saisi-inventaire-light.component.scss'],
  
})
export class SaisiInventaireLightComponent {
  filteredItems: any[] = [];
  selectedPdt: any;
  updateForm!: FormGroup;
  visible: boolean = false;
  visibleCancel: boolean = false;
  errorMsg!: string
  disbale = false;
  isSubmit!: boolean;
  isForKSSV: boolean = false;
  loading!: boolean;
  token: any ='';
  SYSINVENT_AJOUTER_STOCK:  'A'|'R' = 'A' ;
  isAjoutStock: boolean = false;

  @ViewChild('autoCompleteRef') autoComplete!: AutoComplete;
  
  constructor(private serviceInventaire: InventoryService, 
      private fb: FormBuilder,
      private taostsService: ToastrService,) {}
  
  ngOnInit() {
    this.token = this.serviceInventaire.getToken();
    
      this.updateForm = this.fb.group({
          CARTON: ['', Validators.required],
          PIECE: ['', Validators.required],
          AJOUTSTOCK : [this.isAjoutStock]
      })
    }

  async filterItems(event: any) {
    const query = event.query.toLowerCase();
    this.filteredItems = await this.getArticle(query);
  }

  getArticle(query: string): Promise<any[]>{
    return new Promise((resolve, reject) => {
      this.serviceInventaire.getProduit(query).subscribe(
        ((reponse)=>{
          console.log(reponse);
          if (reponse.OK > 0) {
            resolve(reponse.Contenue);
          } else {
            resolve([]);
          }
        })
       ,
        error => {
          reject(error);
        }
      );
    });
  }

  onProduitSelect(event: any){
    console.log(event);
    this.selectedPdt = event;
    if (this.selectedPdt) {
      this.visible = true;
      var stockgros = 0;
      var stockdetail = 0 ;
      if(this.selectedPdt.quantite){
        this.isForKSSV=true;
        stockgros = this.selectedPdt.quantite ;
        if (this.selectedPdt.nbunite && this.selectedPdt.nbunite >0){
          stockgros = Math.floor(this.selectedPdt.quantite / this.selectedPdt.nbunite) ;
          stockdetail = this.selectedPdt.quantite % this.selectedPdt.nbunite ;
        }
      }else if(this.selectedPdt.STOCK){
        stockgros = this.selectedPdt.STOCK ;
        if (this.selectedPdt.nbunite && this.selectedPdt.nbunite >0){
          stockgros = Math.floor(this.selectedPdt.STOCK / this.selectedPdt.nbunite) ;
          stockdetail = this.selectedPdt.STOCK % this.selectedPdt.nbunite ;
        }        
      }else if(this.selectedPdt.Stock){
        stockgros = this.selectedPdt.Stock ;
        if (this.selectedPdt.nbunite && this.selectedPdt.nbunite >0){
          stockgros = Math.floor(this.selectedPdt.Stock / this.selectedPdt.nbunite) ;
          stockdetail = this.selectedPdt.Stock % this.selectedPdt.nbunite ;
        }
      }
      if(this.selectedPdt.SYSINVENT_OK !== "0"){
        if(this.isAjoutStock){
          stockgros = 0 ;
          stockdetail = 0;
        }
      }
      this.updateForm.patchValue({
          CARTON: stockgros,
          PIECE: stockdetail,
          AJOUTSTOCK : [this.isAjoutStock]
      });
    }
  }

  onUpdate() {
    this.isSubmit = true;
    this.loading = true;
    const valForm = this.updateForm.value;
    var CARTON=0;
    var PIECE=0;
    var stockgros = 0;
    var stockdetail = 0 ;
    if(this.selectedPdt.STOCK){
      if (this.selectedPdt.nbunite && this.selectedPdt.nbunite >0){
        stockgros = Math.floor(stockgros / this.selectedPdt.nbunite) ;
        stockdetail = this.selectedPdt.STOCK % this.selectedPdt.nbunite ;
      }        
    }else if(this.selectedPdt.Stock){
      stockgros = this.selectedPdt.Stock ;
      if (this.selectedPdt.nbunite && this.selectedPdt.nbunite >0){
        stockgros = Math.floor(this.selectedPdt.Stock / this.selectedPdt.nbunite) ;
        stockdetail = this.selectedPdt.Stock % this.selectedPdt.nbunite ;
      }
    }
    
    CARTON = Number(valForm.CARTON);
    PIECE = Number( valForm.PIECE);

    if (this.selectedPdt.SYSINVENT_OK !== "0"){
      console.log("Contenue de valForm.AJOUTSTOCK = ", valForm.AJOUTSTOCK);
      
      console.log("Contenue de isAjoutStock = ", this.isAjoutStock);
      if (!this.isAjoutStock){
        valForm.AJOUTSTOCK = "R";
      }
      this.SYSINVENT_AJOUTER_STOCK = valForm.AJOUTSTOCK;
      if ( this.isAjoutStock) {
        CARTON = stockgros +  Number(valForm.CARTON);
        PIECE = stockdetail + Number( valForm.PIECE);
        console.log("CARTON = ", CARTON);
        console.log("PIECE = ", PIECE);
        this.updateForm.patchValue({
          CARTON: Number(this.selectedPdt.Stock) +  valForm.CARTON,
          PIECE: Number(this.selectedPdt.STOCKDETAIL) + valForm.PIECE,
          AJOUTSTOCK : [valForm.AJOUTSTOCK]
        });
      }
    }
    //return ;
    console.log("CARTON FINAL = ", CARTON);
    console.log("PIECE FINAL = ", PIECE);

    var IdPdt=0;
    if (this.selectedPdt.ID){
      IdPdt = this.selectedPdt.ID;
    }else if (this.selectedPdt.Id){
      IdPdt = this.selectedPdt.Id;
    }else if (this.selectedPdt.id){
      IdPdt = this.selectedPdt.id;
    }
    this.serviceInventaire.updateStock('SYSINVENT_SAVE_ARTICLE', IdPdt, CARTON, PIECE, this.token)
      .subscribe({
        next: (response) => {
          if (response.OK === 1) {
            this.loading = false;
            this.errorMsg = response.Autres;
            this.taostsService.success(this.errorMsg, '', {timeOut: 10000});
            this.visible = false;
            this.selectedPdt = null; // Remettez la variable temporaire à null
            // ...après avoir mis this.selectedPdt = null;
            setTimeout(() => {
              if(this.autoComplete){
                this.autoComplete.focus = true;
              }
            }, 1000);
          } else if (response.OK === 0) {
            this.loading = false;
            this.errorMsg = response.TxErreur
            this.taostsService.error(this.errorMsg, '', {timeOut: 10000})
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMsg = error.error.TxErreur;
          this.visible = false;
          this.taostsService.error("Erreur Connexion. Le produit n'est pas inventorié. Veuillez Recharger la page", '', {timeOut: 10000});
          if (this.selectedPdt  && this.isSubmit) {
            this.selectedPdt = null; // Remettez la variable temporaire à null
          }
          this.visible = false;
        },
        complete: () => {
           valForm.AJOUTSTOCK = this.isAjoutStock;
           //this.isAjoutStock=true;
           console.log("Contenue de valForm.AJOUTSTOCK = ", valForm.AJOUTSTOCK);
        }
      })
  }

  confirmCancel (){
    this.visibleCancel = true;
  }

  cancelUpdate(){
    var IdPdt=0;
    if (this.selectedPdt.ID){
      IdPdt = this.selectedPdt.ID;
    }else if (this.selectedPdt.Id){
      IdPdt = this.selectedPdt.Id;
    }else if (this.selectedPdt.id){
      IdPdt = this.selectedPdt.id;
    }
    this.serviceInventaire.cancelUpdateSTock('SYSINVENT_CANCELSAVE_ARTICLE', IdPdt, this.token)
      .subscribe({
        next: (response) => {
          if (response.OK === 1) {
            this.errorMsg = response.Autres
            this.taostsService.success(this.errorMsg, '', {timeOut: 10000})
            this.visible=false
            this.visibleCancel = false;
            this.selectedPdt = null;
            // ...après avoir mis this.selectedPdt = null;
            setTimeout(() => {
              if(this.autoComplete){
                this.autoComplete.focus = true;
              }
            },1000);
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
}
