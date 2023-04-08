import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Rezervation} from "./rezervation";
import {User} from "./user";
import {UserDTO} from "./userDTO";
import {BehaviorSubject, catchError, map, tap} from "rxjs";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  token: string | undefined
  private userSubject = new BehaviorSubject<User | undefined>(undefined);
  constructor(private http: HttpClient,
  private localStorageService: LocalStorageService) {

  }

  getAll(){
    console.log("ziskanie vsetkych userov")
    return this.http.get<User[]>('/api/user');
  }

  getById(id:number){
    return this.http.get<User>('/api/user/' + id);
  }

  getUserRezervation(id:number){
    return this.http.get<Rezervation[]>('/api/user/rezervation/' + id).pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = UserService.getServerErrorMessage(error);
        }
        throw new Error(errorMsg);
      })
    )
  }

  getCurrentUsersInRezervation(){
    return this.http.get<User[]>('/api/user/currentrezervation/').pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = UserService.getServerErrorMessage(error);
        }
        throw new Error(errorMsg);
      })
    )
  }

  getAllUsersInRezervationInDay(date:string){
    return this.http.get<Map<string,User[]>>('/api/user/currentrezervation/'+date).pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = UserService.getServerErrorMessage(error);
        }
        throw new Error(errorMsg);
      })
    )
  }

  getByEmail(email: string, token: string | undefined){
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + token
    });
    return this.http.get<User>('/api/user/email/'+email, {headers}).pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = UserService.getServerErrorMessage(error);
        }
        console.log(errorMsg)
        throw new Error(errorMsg);
      })
    )
  }

  isAutorized(userdto: UserDTO){
    return this.http.post('/api/user/auth/',userdto, {responseType: 'text'})
      .pipe(map(token => {
        if (!token) {
          return undefined
        }
        this.token = token
        this.localStorageService.set("token", token);
        return JSON.parse(atob(token.split('.')[1]))
        }))
      .pipe(tap(user => {
        this.getByEmail(user.sub,this.token).subscribe(value => {
          this.localStorageService.set("user",value)
          this.userSubject.next(value)});
      }))
      .pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = UserService.getServerErrorMessage(error);
        }
        throw new Error(errorMsg);
      }))
  }

  get(){
    return this.userSubject.getValue();
  }

  //tato funkcia nam zabezpeci novu subscripciu a v pripade ze sa stranka reloadne
  // tak uchova v localstorage Usera ktory tu bol vytvoreny
  onUserChange(){
    if (this.localStorageService.get('user') != null){
      this.userSubject.next(this.localStorageService.get("user"));
    }
    return this.userSubject.asObservable();
  }


  logout() {
    this.localStorageService.clearAll();
    this.userSubject.next(undefined);
  }

  add(user: User){
      return this.http.post('/api/user', user).pipe(
        catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = UserService.getServerErrorMessage(error);
          }
          throw new Error(errorMsg);
        })
      );
  }

  edit(user: User) {
    return  this.http.put<void>(`/api/user/${user.id}`, user)

  }

  delete(id:number){
    return this.http.delete<User>("/api/user/" + id )
  }

  private static getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400: {
        return `Not Found}`;
      }
      case 403: {
        return `Access Denied`;
      }
      case 409: {
        return `Duplicity`;
      }
      case 500: {
        return `Internal Server Error`;
      }
      default: {
        return `Unknown Server Error`;
      }

    }
  }
}
