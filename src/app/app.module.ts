import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ListInventoryComponent } from './components/list-inventory/list-inventory.component';
import { PickListModule } from 'primeng/picklist';
import { CategoryPopupComponent } from './components/shared/category-popup/category-popup.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListInventoryComponent,
    CategoryPopupComponent,
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
  ],
  providers: [DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
