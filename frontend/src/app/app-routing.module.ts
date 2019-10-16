import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ClustersyncComponent} from "./clustersync/clustersync.component";
import {PolicyComponent} from "./policy/policy.component";
import {LoginComponent} from "./login/login.component";


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'cluster', component: ClustersyncComponent},
  {path: 'policy', component: PolicyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
