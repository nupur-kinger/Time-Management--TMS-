import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { AppConfig } from './app.config';
import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
        private router: Router) { }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        //handle Auth error or rethrow
        if (err.status === 401 || err.status === 403) {
            //navigate /delete cookies or whatever
            this.router.navigateByUrl(`/401`);
            return of(); 
        }
        return throwError(err);
    }
    
    intercept(request: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = this.authenticationService.employee;
        let token = localStorage.getItem(AppConfig.JWT_TOKEN_KEY);

        if (currentUser && token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return httpHandler.handle(request).pipe(catchError(x=> this.handleAuthError(x)));;
    }
}