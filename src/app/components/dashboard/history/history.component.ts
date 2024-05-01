import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import { ToastrService } from 'ngx-toastr';
import * as jspdf from 'jspdf';
import * as FileSaver from 'file-saver';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit{
  token!: any;
  errorMsg!: string;
  isSubmit!: boolean;
  stocks!: any[];
  selectedStock!:any;
  compareForm!: FormGroup;
  visible: boolean = false;
  data!: any;
  dateNow!: Date;
  infos!: boolean;
  @ViewChild('content')
  content!: ElementRef;
  nomBoutique: any;
  viewDate!: boolean


  products!: any[];

  selectedProducts!: any[];

  cols!: Column[];

  exportColumns!: ExportColumn[];

  generatePDF() {
    this.dateNow = new Date();
    const data = this.content.nativeElement;
    html2canvas(data).then(canvas => {
      const imgWidth = 350;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const pdf = new jspdf.jsPDF('p', 'mm', 'a4'); // orientation portrait
      pdf.text(`Résumé de l'inventaire de ${this.nomBoutique}`, 10, 10);
      pdf.text(`Date: le ${this.dateNow.toLocaleDateString()} à ${this.dateNow.toLocaleTimeString()}`, 10, 20);
      pdf.text(`Ecart Achat: ${this.data.VALEUR_INVENTAIRE.ECART_ACHAT.toLocaleString('fr-FR', {style: 'currency', currency: 'XOF'}).replace(/\s+/g, ' ')}`, 10, 40)
      pdf.text(`Ecart Vente: ${this.data.VALEUR_INVENTAIRE.ECART_VENTE.toLocaleString('fr-FR', {style: 'currency', currency: 'XOF'}).replace(/\s+/g, ' ')}`, 10, 60)
      pdf.text(`Nombre Articles: ${this.data.VALEUR_INVENTAIRE.NB_ARTICLE}`, 10, 80)
      pdf.text(`Valeur Achat: ${this.data.VALEUR_INVENTAIRE.VALEUR_ACHAT.toLocaleString('fr-FR', {style: 'currency', currency: 'XOF'}).replace(/\s+/g, ' ')}`, 10, 100)
      pdf.text(`Valeur Vente: ${this.data.VALEUR_INVENTAIRE.VALEUR_VENTE.toLocaleString('fr-FR', {style: 'currency', currency: 'XOF'}).replace(/\s+/g, ' ')}`, 10, 120)

      pdf.save('resume-inventaire.pdf');
    });
  }

  constructor(
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {}
  ngOnInit(): void {

    this.products = [
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                quantity: 24,
                inventoryStatus: 'INSTOCK',
                rating: 5
            },
            {
                id: '1001',
                code: 'nvklal433',
                name: 'Black Watch',
                description: 'Product Description',
                image: 'black-watch.jpg',
                price: 72,
                category: 'Accessories',
                quantity: 61,
                inventoryStatus: 'OUTOFSTOCK',
                rating: 4
            }]
    if (localStorage.getItem('NOMBOUTIQUE')) {
      this.nomBoutique = localStorage.getItem('NOMBOUTIQUE');
    }
    this.infos = false
    this.token = this.inventoryService.getToken();
    this.loadHistory();
    this.compareForm = this.fb.group({
      label: ['', Validators.required]
    });


    this.cols = [
      { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'quantity', header: 'Quantity' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  exportExcel() {
      import('xlsx').then((xlsx) => {// Sélectionner uniquement les attributs requis pour chaque élément de LISTE_INVENTAIRE
        const dataToExport = this.data.LISTE_INVENTAIRE.map((item: any) => ({
            ID: item.ID,
            Designation: item.Designation,
            Categorie: item.Categorie,
            Rayon: item.Rayon,
            ECART: item.ECART,
            STOCK_CARTON_AVANT: item.STOCK_CARTON_AVANT,
            STOCK_DETAIL_AVANT: item.STOCK_DETAIL_AVANT,
            STOCK_CARTON_APRES: item.STOCK_CARTON_APRES,
            STOCK_DETAIL_APRES: item.STOCK_DETAIL_APRES,
            PrixDetail: item.PrixDetail,
            PrixVenteTTC: item.PrixVenteTTC,
            PrixAchatTTC: item.PrixAchatTTC,
            PrixAchatDetail: item.PrixAchatDetail,
            ECART_PRIXCESSION: item.ECART_PRIXCESSION,
            ECART_PRIXVENTE: item.ECART_PRIXVENTE
        }));
        const worksheet = xlsx.utils.json_to_sheet(dataToExport);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'produits');
      });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  showDialog(event: any) {
      this.visible = true;
      this.selectedStock = event.data;

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
  get label(){
    return this.compareForm.get('label')
  }
  onCompare(){
    this.isSubmit = true;
    this.inventoryService.compare('SYSINVENT_COMPARE', this.selectedStock.LABEL, this.token)
      .subscribe({
        next: (response) => {
          if (response.OK === 1) {
            this.data = response.Contenue;
            this.visible = false;
            this.infos = true
          }
          else if(response.OK === 0){
            this.toastrService.error(response.TxErreur, '', {timeOut: 10000});
            this.visible = false;
            this.infos = false
          }
        },
        error: (error) => {
          this.toastrService.error(error.error.TxErreur, '', {timeOut: 10000});
          this.visible = false;
          this.infos = false
        }
      })
  }

  onRowSelect(event: any) {
  }

  onRowUnselect(event: any) {
  }
}


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
