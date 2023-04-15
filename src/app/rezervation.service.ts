import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
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
    return this.http.get<Rezervation[]>('/api/rezervation/kalendar/' + date).pipe(
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
    return this.http.get<number>('/api/rezervation/time/' +date).pipe(
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
    // @ts-ignore
    return this.http.post("/api/rezervation/time/" + id + '/' + date).pipe(
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
    // @ts-ignore
    return this.http.delete("/api/rezervation/time/cancel/" + date + '/' + id ).pipe(
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
