import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ListInventoryComponent } from './components/dashboard/list-inventory/list-inventory.component';
import { PickListModule } from 'primeng/picklist';
import { CategoryPopupComponent } from './components/shared/category-popup/category-popup.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InitializeComponent } from './components/dashboard/initialize/initialize.component';
import { ReinitializeComponent } from './components/dashboard/reinitialize/reinitialize.component';
import { HistoryComponent } from './components/dashboard/history/history.component';
import { MessageService } from 'primeng/api';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListInventoryComponent,
    CategoryPopupComponent,
    DashboardComponent,
    InitializeComponent,
    ReinitializeComponent,
    HistoryComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    ButtonModule,
    PickListModule,
    DialogModule,
    ListboxModule,
    HttpClientModule,
    TableModule
  ],
  providers: [DialogService, MessageService,

    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
