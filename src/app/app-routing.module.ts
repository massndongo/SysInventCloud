import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListInventoryComponent } from './components/dashboard/list-inventory/list-inventory.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { childActivateGuard } from './guards/child-activate.guard';
import { InitializeComponent } from './components/dashboard/initialize/initialize.component';
import { ReinitializeComponent } from './components/dashboard/reinitialize/reinitialize.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: 'connexion', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [childActivateGuard],
    loadChildren: () =>
      import('src/app/components/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
