import { Component, OnInit } from '@angular/core';
import { Employee } from './shared/employee.model';
import { AuthenticationService } from './authentication.service';
import { AppConfig } from './app.config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  employee: Employee;
  isLoggedIn: boolean;
  title = 'time-management';

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.employee = this.authenticationService.employee;
    let loggedIn = localStorage.getItem(AppConfig.IS_LOGGED_IN_KEY);
    this.isLoggedIn = loggedIn === "1"; 

    this.authenticationService.employeeObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.employee = this.authenticationService.employee;
      this.isLoggedIn = this.authenticationService.isLoggedIn();
    });
  }

  private ngUnsubscribe = new Subject();
  ngOnDestroy() {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
  }
}
