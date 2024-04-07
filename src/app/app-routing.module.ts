import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListInventoryComponent } from './components/dashboard/list-inventory/list-inventory.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'menu', component: DashboardComponent,
    children: [
      { path: '', component: ListInventoryComponent },
      { path: 'liste-inventaire', component: ListInventoryComponent },
    ]
   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
