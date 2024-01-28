import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_NAME = 'Key';
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  user: any | null;
  tokens:any;
  get token(): any {

    return localStorage.getItem(this.TOKEN_NAME);
  }

  get userName(): any {
    return localStorage.getItem("userName");
  }
  get profile(): any {
    return localStorage.getItem("profile");
  }
  get role():any {
    return localStorage.getItem("role");

  }
  get state():any {
    return localStorage.getItem("state");

  }
  get id():any {
    return localStorage.getItem("id");

  }
  constructor(private apiService: AccountService, private router: Router) {
    this._isLoggedIn$.next(!!this.token);
  }

  login(val:any) {
    return this.apiService.login(val).pipe(
      tap((response: any) => {
        this._isLoggedIn$.next(true);
        console.log(response);
        localStorage.setItem(this.TOKEN_NAME, response.token);

        localStorage.setItem("userName", JSON.stringify(response.user.name))
        localStorage.setItem("id", JSON.stringify(response.user.id))
        localStorage.setItem("ref", JSON.stringify(response.user.href))

        this.router.navigate(['/home']);



      })
    );
  }

 async logout(){
    this._isLoggedIn$.next(false);
    localStorage.clear();
    window.location.reload();
  }
  cleardata(){
    localStorage.clear();

  }

  private getUser(token: any): User | null {
    if (!token) {
      return null
    }

    let data=  JSON.parse(atob(token.split('.')[1])) as User;
    console.log(data)
    return data;
  }
}
