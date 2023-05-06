import { Component} from '@angular/core';
import {UserService} from "../user.service";
import {Observable} from "rxjs";
import {User} from "../user";

@Component({
  selector: 'app-watcher',
  templateUrl: './watcher.component.html',
  styleUrls: ['./watcher.component.scss']
})
export class WatcherComponent{

  user$: Observable<User | undefined>;
  user!: User;

  constructor(private userService: UserService) {
    this.user$ =this.userService.onUserChange()
    if (this.user$ != undefined) {
      this.user$.subscribe(value => {
          // @ts-ignore
          this.user = value;
        }
      )
    }
  }



}
