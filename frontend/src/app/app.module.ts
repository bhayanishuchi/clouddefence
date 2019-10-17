import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClustersyncComponent } from './clustersync/clustersync.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {UserService} from "./service/socket.service";
import {FormsModule} from "@angular/forms";
import {ChartsModule} from "ng2-charts";
import { NiceSelectModule } from "ng-nice-select";


import {environment} from "../environments/environment";
import { PolicyComponent } from './policy/policy.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const config: SocketIoConfig = { url: environment.socketUri, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ClustersyncComponent,
    HeaderComponent,
    FooterComponent,
    PolicyComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ChartsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    NiceSelectModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
