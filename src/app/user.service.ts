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
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get<User[]>('/api/user', {headers});
  }

  getById(id:number){
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get<User>('https://jurezapp-production.up.railway.app/api/user/' + id, {headers});
  }

  getUserRezervation(id:number){
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get<Rezervation[]>('https://jurezapp-production.up.railway.app/api/user/rezervation/' + id, {headers}).pipe(
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
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get<User[]>('https://jurezapp-production.up.railway.app/api/user/currentrezervation/',{headers}).pipe(
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
    let headers = new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  });
    return this.http.get<Map<string,User[]>>('https://jurezapp-production.up.railway.app/api/user/currentrezervation/'+date, {headers}).pipe(
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
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + token
    });
    return this.http.get<User>('https://jurezapp-production.up.railway.app/api/user/email/'+email, {headers}).pipe(
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
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post('https://jurezapp-production.up.railway.app/api/user/auth/',userdto, {headers,responseType: 'text'})
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
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
      return this.http.post('https://jurezapp-production.up.railway.app/api/user', user,{headers}).pipe(
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

  edit(user: User){
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return  this.http.put<void>(`https://jurezapp-production.up.railway.app/api/user/${user.id}`, user , {headers})

  }

  delete(id:number){
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.delete<User>("https://jurezapp-production.up.railway.app/api/user/" + id , {headers} )
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
