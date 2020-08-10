import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfig } from './app.config';
import { Router } from '@angular/router';
import { Employee, EmployeeDetails } from './shared/employee.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateService } from './state.service';
import { take } from 'rxjs/operators';

export interface Credentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private employeeSubject: BehaviorSubject<any>;
  public employeeObservable: Observable<any>;

  private inProgressSubject: BehaviorSubject<boolean>;
  public inProgressObservable: Observable<boolean>;

  constructor(private httpClient: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private stateService: StateService) {
    this.employeeSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem(AppConfig.CURRENT_USER_KEY)));
    this.employeeObservable = this.employeeSubject.asObservable();

    this.inProgressSubject = new BehaviorSubject<boolean>(false);
    this.inProgressObservable = this.inProgressSubject.asObservable();
  }

  login(credentials, onAuthenticationFailed: Function, objRef): boolean {
    this.inProgressSubject.next(true);
    this.httpClient.post(`${AppConfig.AUTHENTICATION_API}/login`, credentials)
      .pipe(take(1))
      .subscribe((data: { employeeDetails: EmployeeDetails, token: string }) => {
        this.inProgressSubject.next(false);
        if (data.employeeDetails && data.token) {
          localStorage.setItem(AppConfig.JWT_TOKEN_KEY, data.token);
          localStorage.setItem(AppConfig.IS_LOGGED_IN_KEY, "1");
          this.storeEmployee(data.employeeDetails);
          this.router.navigate(['home']);
        } else {
          console.log("Couldn't log in");
          onAuthenticationFailed(objRef);
        }
        // LoginComponent.loading=false;
      },
        error => {
          this.inProgressSubject.next(false);
          if (error.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            console.error(`Backend returned code ${error.status}`);
            this.openSnackBar(AppConfig.BACKEND_ERROR_MESSAGE);
          }
        }
      );
    return false;
  }

  logout() {
    this.stateService.clear();

    localStorage.removeItem(AppConfig.JWT_TOKEN_KEY);
    localStorage.removeItem(AppConfig.CURRENT_USER_KEY);
    localStorage.setItem(AppConfig.IS_LOGGED_IN_KEY, "0");
    this.employeeSubject.next(null);

    this.router.navigate(['login']);
  }

  refreshEmployee() {
    this.httpClient.get<EmployeeDetails>(`${AppConfig.EMPLOYEE_API}/get`, {
      params: new HttpParams().set('e', `${this.employee.employeeId}`)
    }).pipe(take(1))
      .subscribe(emp => this.storeEmployee(emp), error => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          console.error(`Backend returned code ${error.status}`);
          this.openSnackBar(AppConfig.BACKEND_ERROR_MESSAGE);
        }
      });
  }

  storeEmployee(employeeDetails: EmployeeDetails) {
    localStorage.setItem(AppConfig.CURRENT_USER_KEY, JSON.stringify(employeeDetails));
    this.employeeSubject.next(employeeDetails);
  }

  public get employee(): EmployeeDetails {
    return this.employeeSubject.value;
  }

  public get role(): number {
    return this.employee.role;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(AppConfig.IS_LOGGED_IN_KEY) === "1";
  }

  hasToken(): boolean {
    return localStorage.getItem(AppConfig.JWT_TOKEN_KEY) !== undefined;
  }

  isAuthenticated(): boolean {
    return this.employee !== undefined && this.isLoggedIn() && this.hasToken();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}

