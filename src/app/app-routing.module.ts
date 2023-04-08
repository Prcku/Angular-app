import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {AdminComponent} from "./admin/admin.component";
import {NewUserComponent} from "./new-user/new-user.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {EditUserComponent} from "./edit-user/edit-user.component";
import {MyRezervationComponent} from "./my-rezervation/my-rezervation.component";
import {UserGuard} from "./user.guard";
import {KalendarComponent} from "./kalendar/kalendar.component";
import {WatcherComponent} from "./watcher/watcher.component";
import {AllRezervationComponent} from "./all-rezervation/all-rezervation.component";

const routes: Routes = [
  {path:'home',
    component: KalendarComponent ,
    canActivate: [UserGuard],
    data: {
      role: 'ROLE_USER',
    }},
  {path:'login', component: LoginComponent},
  {path: 'home/mojerezervacie/:id',
    component: MyRezervationComponent ,
    canActivate: [UserGuard],
    data: {
      role: 'ROLE_USER',
    }},
  {path:'adminpage',
    component: AdminComponent ,
    canActivate: [UserGuard],
    data: {
      role: 'ROLE_ADMIN'
    }},
  {path:'login/newUser', component: NewUserComponent },
  {path:'adminpage/:id/editUser',
    component: EditUserComponent ,
    canActivate: [UserGuard],
    data: {
      role: 'ROLE_ADMIN',
    }},
  {path:'info',
    component: WatcherComponent,
    canActivate: [UserGuard],
    data: {
      role: 'ROLE_WATCHER'
    }},
  {path:'adminpage/allrezervation',
    component: AllRezervationComponent,
    canActivate: [UserGuard],
    data: {
      role: 'ROLE_ADMIN'
    }},
  {path:'', redirectTo: 'login', pathMatch: 'full'},
  {path:'**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
