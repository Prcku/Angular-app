import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {combineAll, Observable} from 'rxjs';
import {UserService} from "./user.service";
import {User} from "./user";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class UserInterceptor implements HttpInterceptor {

  private user: User | undefined;

  constructor(private userService: UserService,
  private localStorageService: LocalStorageService) {
    userService.onUserChange()
      .subscribe(value => {
        this.user = value;
      })
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.localStorageService.get("token")) {
      return next.handle(request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.localStorageService.get("token")
        }
      }));
    }
    return next.handle(request)
  }
}
