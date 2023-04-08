import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { LoginComponent } from './login/login.component';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AdminComponent } from './admin/admin.component';
import { NewUserComponent } from './new-user/new-user.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MyRezervationComponent } from './my-rezervation/my-rezervation.component';
import {UserInterceptor} from "./user.interceptor";
import {DataTablesModule} from "angular-datatables";
import {DatePipe} from "@angular/common";
import {UserGuard} from "./user.guard";
import { KalendarComponent } from './kalendar/kalendar.component';
import {LocalStorageModule} from "angular-2-local-storage";
import { WatcherComponent } from './watcher/watcher.component';
import {AllRezervationComponent} from "./all-rezervation/all-rezervation.component";
import {ModalModule} from "ngx-bootstrap/modal";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DataTablesModule,
    FormsModule,
    HttpClientModule,
    LocalStorageModule.forRoot({
      prefix: 'user',
      storageType: "localStorage"
    })
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    NewUserComponent,
    NotFoundComponent,
    EditUserComponent,
    MyRezervationComponent,
    KalendarComponent,
    WatcherComponent,
    AllRezervationComponent
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: UserInterceptor, multi: true},
  UserGuard,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
