import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  selectedShop!: any
  visible!: any
  nomBoutique: any;
  constructor(
    private router : Router
  ) {}
  ngOnInit(): void {

    initFlowbite();
    this.selectedShop = localStorage.getItem('MODEINVENTAIRE');
    if (this.selectedShop) {
      this.visible = this.selectedShop;
    }
    if (localStorage.getItem('NOMBOUTIQUE')) {
      this.nomBoutique = localStorage.getItem('NOMBOUTIQUE');

    }
  }

logout(){
  localStorage.removeItem('token');
  this.router.navigate([''])
}
}
