import { Injectable } from '@angular/core';
import { Observable, catchError, from, retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import axios from 'axios';


import { environment } from 'src/environments/environment.prod';
import { Login } from '../models/account/login';
import { User } from '../models/user';
import { Image } from '../models/image';


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
export class ImageService {
  serverKey = "m1QdL0d4wjeKS/5ORAZ9I+JIEOB63phB4r4yfR5hk8lI9aL13VMyG82thKA2z0L9C7OmqgUPo36QssEnYUyOtGq7v8Q21M7iYEe88oW1ZxJN6yoyTeYTsMGtXq+Qh8pqd7zy3FcCkS4oUO1JAPr/1N+SqOeJqE5m2qvTRT4q84E=";
  constructor(private httpCient: HttpClient) { }

  upload(base64: any | ArrayBuffer) : Observable<any> {
    let data = JSON.stringify({
      "data": `${base64.base64String}`
    });


  const axiosPromise =  axios( {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://comem-qimg.onrender.com/api/images/',
      headers: {
        'Authorization': 'Bearer X8OctMH8qCLY5/CcC1n7GAaOtgbo4OufqcZYkNzHQT4HEGvjz4JoTeXY2b/UXDkrJCQYUiy0b6WUE2Cs+curDyjtcoF6pEPuWW4d2hd/8Qcpkr/3aD/0W5E4Vn54WefDfZi5h/v+uc/n6LAEf12rGoG86wCohmJhGh9FfSoF1f0=',
        'Content-Type': 'application/json'
      },
      data : data
    })



    return from(axiosPromise);

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
