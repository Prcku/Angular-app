import {Component, NgZone } from '@angular/core';
import {NgForm} from "@angular/forms";
import {UserService} from "../user.service";
import { Router} from "@angular/router";
import {UserDTO} from "../userDTO";
import {LocalStorageService} from "angular-2-local-storage";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  item = {} as UserDTO;
  error: string | undefined;
  guser: any;

  constructor(private userService: UserService,
              private router: Router,) {

  }
  check(formElemnt: NgForm){
   if (formElemnt.invalid){
     return
   }
   this.item.email = formElemnt.value.email;
   this.item.password = formElemnt.value.password;
   this.userService.isAutorized(this.item).subscribe(value => {

     if (value.authorities[0] == "ROLE_USER"){
       this.router.navigate(['/home'])
     }
     else if(value.authorities[0] == "ROLE_ADMIN"){
       this.router.navigate(['/adminpage'])
     }
     else if(value.authorities[0] == "ROLE_WATCHER"){
       this.router.navigate(['/info'])
     }
     },
     error => {
        if (error){
          this.error = error;
        }
     }
   )
  }
}
