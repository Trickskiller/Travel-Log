import { Injectable } from '@angular/core';
import {  throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PlaceService extends BaseService<any> {

  constructor(private httpCient: HttpClient) {
    super(
      httpCient,
      "places"
    );
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
