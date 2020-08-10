import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class LoginGuardService implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}
  canActivate(): boolean {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}