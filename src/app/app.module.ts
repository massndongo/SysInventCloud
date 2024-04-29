import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListboxModule } from 'primeng/listbox';
import { MessageService } from 'primeng/api';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { registerLocaleData } from "@angular/common";
import * as fr from '@angular/common/locales/fr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    DashboardModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    ListboxModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: false,
      enableHtml: true,
      positionClass: 'toast-top-center',
    }),
  ],
  providers: [
    DialogService,
    MessageService,
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

  constructor() {
    registerLocaleData(fr.default);
  }
}
