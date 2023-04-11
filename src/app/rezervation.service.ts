import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Rezervation} from "./rezervation";
import {User} from "./user";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RezervationService {

  constructor(private http: HttpClient) {

  }

  getGeneratedRezervation(date: string ){
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get<Rezervation[]>('https://jurezapp-production.up.railway.app/api/rezervation/kalendar/' + date, {headers}).pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = this.getServerErrorMessage(error);
        }
        console.log("all rezervation")
        console.log(errorMsg)
        throw new Error(errorMsg);
      })
    );
  }

  getRezervationOnThisTime(date: string | null){
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get<number>('https://jurezapp-production.up.railway.app/api/rezervation/time/' +date, {headers}).pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = this.getServerErrorMessage(error);
        }
        throw new Error(errorMsg);
      })
    );
  }

  bookRezervation(date: string | null, id: number){
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    // @ts-ignore
    return this.http.post("https://jurezapp-production.up.railway.app/api/rezervation/time/" + id + '/' + date, {headers}).pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = this.getServerErrorMessage(error);
        }
        throw new Error(errorMsg);
      })
    );
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400: {
        return `Not Found`;
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

  cancelRezervation(date: string, id:number){
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    // @ts-ignore
    return this.http.delete("https://jurezapp-production.up.railway.app/api/rezervation/time/cancel/" + date + '/' + id , {headers}).pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = this.getServerErrorMessage(error);
        }
        console.log("cancel rezervation")
        console.log(errorMsg)
        throw new Error(errorMsg);
      })
    );
  }
}
