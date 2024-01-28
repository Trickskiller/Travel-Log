import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private httpCient: HttpClient) {

  }

  getAll(): Observable<any> {
    //console.log(this.endpoint)
    return this.httpCient
      .get<any>(`${environment.apiStorage}/api/uploads`,httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleErrors)
      )
  }


  getById(id: string): Observable<any> {
    return this.httpCient
      .get<any>(`${environment.apiStorage}/api/uploads/${id}`)
      .pipe(
        retry(2),
        catchError(this.handleErrors)
      )
  }

  create(item: any): Observable<any> {
    console.log(item);

    let image = new FormData();
    image.append('title', item.title);
    image.append('description', item.description);
    for(let i= 0; i<item.image.length; i++){
      image.append('image', item.image[i]);
    }

    console.log(image.getAll("image"));
    return this.httpCient.post<any>(`${environment.apiStorage}/api/uploads`, image)
      .pipe(
        retry(2),
        catchError(this.handleErrors)
      )

  }

  update(item: any): Observable<any> {
    return this.httpCient.put<any>(`${environment.apiStorage}/api/uploads`, JSON.stringify(item),httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleErrors)
      )
  }

 delete(item: any) {
    return this.httpCient.delete<any>(`${environment.apiStorage}/api/uploads/${item.id}`,httpOptions)
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
