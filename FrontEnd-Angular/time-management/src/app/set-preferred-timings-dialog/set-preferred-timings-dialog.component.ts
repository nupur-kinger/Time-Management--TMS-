import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { Employee, EmployeeDetails } from '../shared/employee.model';
import { AppConfig } from '../app.config';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
import { DateSelectionModelChange } from '@angular/material/datepicker';
import { take } from 'rxjs/operators';

interface Timings {
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'set-preferred-timings',
  templateUrl: './set-preferred-timings-dialog.component.html',
  styleUrls: ['./set-preferred-timings-dialog.component.css']
})
export class SetPreferredTimingsDialogComponent implements OnInit {
  form: FormGroup;
  public endTime1;
  public startTime1;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SetPreferredTimingsDialogComponent>) {
    this.form = this.formBuilder.group({
      startTime: new FormControl(),
      endTime: new FormControl()
    });
  }

  ngOnInit(): void {
    this.endTime1 = new Date(this.authenticationService.employee.endTime);
    this.form.controls['endTime'].setValue(this.endTime1);
    this.startTime1 = new Date(this.authenticationService.employee.startTime);
    this.form.controls['startTime'].setValue(this.startTime1);
  }

  // onSave(timings: Timings) {
  onSave(form) {
    let employee: Employee = this.authenticationService.employee;
    employee.dateOfBirth = new Date(employee.dateOfBirth);
    employee.startTime = form.startTime;
    employee.endTime = form.endTime;

    this.httpClient.put<EmployeeDetails>(`${AppConfig.EMPLOYEE_API}/update`, employee)
      .pipe(take(1))
      .subscribe(
        (data: EmployeeDetails) => {
          this.openSnackBar("Timings updated successfully !");
          this.authenticationService.storeEmployee(data);
          this.dialogRef.close();
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

  onCancel() {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
