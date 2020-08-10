import { Component, OnInit } from '@angular/core';
import { Employee } from '../shared/employee.model';
import { AuthenticationService } from '../authentication.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  emp: Employee = this.authenticationService.employee;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.authenticationService.employeeObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => { 
      if (data != null) {
        this.emp = this.authenticationService.employee; 
      }
    });
  }

  private ngUnsubscribe = new Subject();
  ngOnDestroy() {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
  }
}
