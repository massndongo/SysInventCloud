import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { InitializeComponent } from './initialize/initialize.component';
import { ReinitializeComponent } from './reinitialize/reinitialize.component';
import { ListInventoryComponent } from './list-inventory/list-inventory.component';
import { HistoryComponent } from './history/history.component';
import { childActivateGuard } from 'src/app/guards/child-activate.guard';
import { SaisiInventoryComponent } from './saisi-inventory/saisi-inventory.component';

const routes: Routes = [
  {
    path: "menu", component: DashboardComponent,
    // canActivate: [childActivateGuard],
    children: [
      { path: '', component: SaisiInventoryComponent },
      { path: 'liste-inventaire', component: SaisiInventoryComponent },
      { path: 'initialiser', component: InitializeComponent },
      { path: 'reinitialiser', component: ReinitializeComponent },
      { path: 'historiques', component: HistoryComponent },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
