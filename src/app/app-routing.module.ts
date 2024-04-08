import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListInventoryComponent } from './components/dashboard/list-inventory/list-inventory.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { childActivateGuard } from './guards/child-activate.guard';
import { InitializeComponent } from './components/dashboard/initialize/initialize.component';
import { ReinitializeComponent } from './components/dashboard/reinitialize/reinitialize.component';
import { HistoryComponent } from './components/dashboard/history/history.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: 'connexion', component: LoginComponent },
  { path: 'menu', component: DashboardComponent,
  canActivateChild: [childActivateGuard],
    children: [
      { path: '', component: ListInventoryComponent },
      { path: 'liste-inventaire', component: ListInventoryComponent },
      { path: 'initialiser', component: InitializeComponent },
      { path: 'reinitialiser', component: ReinitializeComponent },
      { path: 'historiques', component: HistoryComponent },
    ]
   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
