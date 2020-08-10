import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeDetails } from '../shared/employee.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { EditEmployeeComponent } from '../edit-employee/edit-employee.component';
import { AuthenticationService } from '../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StateService } from '../state.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employeeDetails: EmployeeDetails[];
  columnsToDisplay: string[] = ['name', 'email', 'designation', 'project', 'manager', 'actions'];

  constructor(private httpClient: HttpClient,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private stateService: StateService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.authenticationService.role !== 2 && this.authenticationService.role !== 1) {
      this.router.navigate(['401']);
    }
    this.refreshData();
  }

  addEmployeeDialog() {
    let dialogRef = this.dialog.open(AddEmployeeComponent);
    dialogRef.afterClosed().pipe(take(1)).subscribe(() => this.refreshData());
  }

  edit(employee: Employee) {
    let dialogRef = this.dialog.open(EditEmployeeComponent, { data: employee });
    dialogRef.afterClosed().pipe(take(1)).subscribe(() => this.refreshData());
  }

  delete(employeeId: number) {
    let dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, { data: "Delete Employee" });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.httpClient.delete(`${AppConfig.EMPLOYEE_API}/delete`, {
          params: new HttpParams().set('t', employeeId.toString(10))
        }).pipe(take(1)).subscribe(
          data => {
            this.openSnackBar("Employee details deleted !");
            this.refreshData();
          },
          error => {
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
    });
  }

  refreshData() {
    if (this.authenticationService.role == 2) { // MANAGER
      this.httpClient.get<EmployeeDetails[]>(`${AppConfig.EMPLOYEE_API}/getAllReportings`, {
        params: new HttpParams().set('mid', this.authenticationService.employee.employeeId.toString(10))
      }).pipe(take(1)).subscribe(data => this.reloadData(data), error => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          console.error(`Backend returned code ${error.status}`);
          this.openSnackBar(AppConfig.BACKEND_ERROR_MESSAGE);
        }
      });
    } else if (this.authenticationService.role == 1) { // ADMIN
      this.httpClient.get<EmployeeDetails[]>(`${AppConfig.EMPLOYEE_API}/getAll`)
        .pipe(take(1))
        .subscribe(data => this.reloadData(data), error => {
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
  }

  reloadData(data: EmployeeDetails[]) {
    this.employeeDetails = data;
    this.employeeDetails.forEach(emp => {
      emp.dateOfBirth = new Date(emp.dateOfBirth);
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  navigateToTaskList(employee: Employee) {
    this.stateService.store(employee);
    this.router.navigate(['home/employeeList/taskList', employee.employeeId]);
  }
}
