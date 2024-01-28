import { Base } from "../models/base";
import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders, HttpParams, HttpXhrBackend } from "@angular/common/http";
import { catchError, Observable, retry, throwError } from "rxjs";
import { environment } from "src/environments/environment.prod";


export class BaseService<T extends Base> {

  constructor(
    private httpClient: HttpClient,
    private endpoint: string,
  ) {

  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'rejectUnauthorized': 'false'
    })
  }

  getAll(): Observable<T[]> {
    //console.log(this.endpoint)
    return this.httpClient
      .get<T[]>(`${environment.apiUrl}/${this.endpoint}?include=trip.user`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  getAllO(): Observable<T[]> {
    //console.log(this.endpoint)
    return this.httpClient
      .get<T[]>(`${environment.apiUrl}/${this.endpoint}?include=trip.user&pageSize=25`, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }


  getById(id: string): Observable<T> {
    return this.httpClient
      .get<T>(`${environment.apiUrl}/${this.endpoint}/${id}?include=user`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  create(item: any): Observable<T> {
    console.log("ok")
    return this.httpClient.post<T>(`${environment.apiUrl}/${this.endpoint}`, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )

  }

  update(item: T): Observable<T> {
    console.log(item)
    return this.httpClient.put<T>(`${environment.apiUrl}/${this.endpoint}/${item.id}`, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  updates(item: T): Observable<T> {
    console.log(item)
    return this.httpClient.patch<T>(`${environment.apiUrl}/${this.endpoint}/${item.id}`, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  updatePersmissions(item: T): Observable<T> {
    return this.httpClient.put<T>(`${environment.apiUrl}/${this.endpoint}/changePermission`, JSON.stringify(item), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  /**updateProjet(item: any): Observable<T> {
    console.log(item);
    return this.httpClient.put<any>(`${environment.apiUrl}/${this.endpoint}/{id}/update?id=${item.id}&name=${item.name}&description=${item.description}&notifyUrl=${item.notifyUrl}
    &cancelUrl=${item.cancelUrl}&successUrl=${item.successUrl}&websiteUrl=${item.websiteUrl}&itemTypeSold=${item.itemTypeSold}&nameOfItemSold=${item.itemTypeSold}&isCustomerCharge=${true}
    &organizationID=${item.organizationID}&principalCode=${item.principalCode}&isPrivacyPolicyRead=${true}&operateurs=${item.operateurs}
    `, JSON.stringify(item),this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
**/
  delete(item: T) {
    return this.httpClient.delete<T>(`${environment.apiUrl}/${this.endpoint}/${item.id}`, this.httpOptions)
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }
  deleteP(item: T) {
    return this.httpClient.delete<T>(`${environment.apiUrl}/${this.endpoint}/${item}`, this.httpOptions)
      .pipe(
        retry(0),
        catchError(this.handleError)
      )
  }
   generateRandomColor(): string {
    // Génère une couleur hexadécimale aléatoire
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage;
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status == 200) {
        errorMessage = { "code": error.status, "message": "OK" };

      } else {
        errorMessage = { "code": error.status, "message": error };

      }
    }
    return throwError(errorMessage);
  }
}
