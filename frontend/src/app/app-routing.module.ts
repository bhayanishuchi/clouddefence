import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ClustersyncComponent} from "./clustersync/clustersync.component";


const routes: Routes = [
  {path :'', component: DashboardComponent},
  {path : 'cluster', component: ClustersyncComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
