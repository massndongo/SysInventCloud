import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  selectedShop!: any
  visible!: any
  constructor(
    private router : Router
  ) {}
  ngOnInit(): void {
    this.selectedShop = localStorage.getItem('MODEINVENTAIRE');
    if (this.selectedShop) {
      this.visible = this.selectedShop;

    }
  }

logout(){
  localStorage.removeItem('token');
  this.router.navigate([''])
}
}
