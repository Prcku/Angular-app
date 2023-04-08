import { Component } from '@angular/core';
import {UserService} from "./user.service";
import {User} from "./user";
import {Observable, Subscription} from "rxjs";
import {LocalStorageService} from "angular-2-local-storage";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Jurez-FE';
  user$: Observable<User | undefined>;
  user: any;

  constructor(private userService: UserService,
              private localStorageService: LocalStorageService) {
    this.user$ =this.userService.onUserChange();
    console.log(this.user$)
    if (this.user$ == undefined){
      this.user$ = this.localStorageService.get("user")
    }
  }


  ngOnDestroy(){
     // this.subscription.unsubscribe();
  }

  logout() {
    this.localStorageService.clearAll();
    this.userService.logout()
  }
}
