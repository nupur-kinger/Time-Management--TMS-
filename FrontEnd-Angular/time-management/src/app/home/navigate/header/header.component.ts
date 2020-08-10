import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Employee } from 'src/app/shared/employee.model';
import { AuthenticationService } from 'src/app/authentication.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  emp: Employee;
  name: string;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.employeeObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data == null) return;
      this.setEmployeeDetails();
    });
  }

  setEmployeeDetails() {
    this.emp = this.authenticationService.employee;
    this.name = `${this.emp.firstName} ${this.emp.lastName}`;
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  logout() {
    this.authenticationService.logout();
  }

  private ngUnsubscribe = new Subject();
  ngOnDestroy() {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
  }
}
