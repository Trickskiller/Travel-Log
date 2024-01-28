import { Injectable } from '@angular/core';
import {  Observable, catchError, retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {

  constructor(private httpCient: HttpClient) {
    super(
      httpCient,
      "users"
    );
  }

  getUserProject(id: string): Observable<User> {
    return this.httpCient
    .get<User>(`${environment.apiUrl}/users/${id}/objects`, )
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
        errorMessage = { "Code d'erreur": error.status, "message": error.error.message };

      }
    }
    return throwError(errorMessage);
  }
}
