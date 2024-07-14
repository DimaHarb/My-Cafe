import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/constants/urls';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { IUserRegister } from '../shared/interfaces/IUserRegister';
import { User } from '../shared/models/User';
import { CartService } from './cart.service';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(
    this.getUserFromLocalStorage()
  );
  public userObservable: Observable<User>;

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private cartService: CartService
  ) {
    this.userObservable = this.userSubject.asObservable();
    console.log('UserService initialized');
  }

  login(userLogin: IUserLogin): Observable<User> {
    console.log('Attempting login with', userLogin);
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          console.log('Login successful, user:', user);
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          console.log('Loading cart from local storage on login...');
          this.cartService.loadCartFromLocalStorage();
        },
        error: (errorResponse) => {
          console.log('Login failed:', errorResponse);
          this.toastrService.error(errorResponse.error, 'Login Failed');
        },
      })
    );
  }

  register(userRegister: IUserRegister): Observable<User> {
    console.log('Attempting registration with', userRegister);
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => {
          console.log('Registration successful, user:', user);
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          console.log('Loading cart from local storage on register...');
          this.cartService.loadCartFromLocalStorage();
        },
        error: (errorResponse) => {
          console.log('Registration failed:', errorResponse);
          this.toastrService.error(errorResponse.error, 'Register Failed');
        },
      })
    );
  }

  logout() {
    console.log('Logging out...');
    this.cartService.saveCartToLocalStorage();
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserToLocalStorage(user: User) {
    console.log('Saving user to local storage:', user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    console.log('Loading user from local storage:', userJson);
    if (userJson) return JSON.parse(userJson) as User;
    return new User();
  }
}
