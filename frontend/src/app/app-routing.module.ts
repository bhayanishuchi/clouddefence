import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ClustersyncComponent} from "./clustersync/clustersync.component";
import {PolicyComponent} from "./policy/policy.component";


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'cluster', component: ClustersyncComponent},
  {path: 'policy', component: PolicyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
