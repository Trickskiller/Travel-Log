import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';


import { environment } from 'src/environments/environment.prod';
import { Login } from '../models/account/login';
import { User } from '../models/user';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'rejectUnauthorized': 'false'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpCient: HttpClient) { }

  login(login: Login): Observable<User> {
    const url = `${environment.apiUrl}/auth`;
    return this.httpCient.post<User>(url, login, httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleErrors)
      )
  }


  private handleErrors(error: HttpErrorResponse) {
    let errorMessage;
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status == 200) {
        errorMessage = { "Code d'erreur": error.status, "message": "OK" };

      } else {
        errorMessage = { "Code d'erreur": error.status, "message": error.error.error };

      }
    }
    return throwError(errorMessage);
  }
}
