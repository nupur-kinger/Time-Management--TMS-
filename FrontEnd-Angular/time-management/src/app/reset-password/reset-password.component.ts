import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { PASSWORD_REGEX } from '../employee.utils';
import { AppConfig } from '../app.config';
import { take } from 'rxjs/operators';

class ResetPasswordDetails {
  employeeId: number;
  currentPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  actionInProgress: boolean = false;

  constructor(private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      // employeeId: new FormControl(this.authenticationService.employee.employeeId),
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.pattern(PASSWORD_REGEX)])
    });
  }

  onSave(details: ResetPasswordDetails) {
    if (this.form.invalid) {
      return;
    }

    this.actionInProgress = true;
    details.employeeId = this.authenticationService.employee.employeeId;

    this.httpClient.post<ResetPasswordDetails>(`${AppConfig.EMPLOYEE_API}/resetPassword`, details)
      .pipe(take(1))
      .subscribe(
        data => {
          this.openSnackBar("Password has been reset successfully !");
          this.form.reset();
          this.form.markAsPristine();
          this.form.markAsUntouched();
          this.form.updateValueAndValidity();
          this.actionInProgress = false;
        },
        error => {
          if (error.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            console.error(`Backend returned code ${error.status}`);
            this.openSnackBar(error.status === 400 ? error.error : AppConfig.BACKEND_ERROR_MESSAGE);
          }
          this.actionInProgress = false;
        });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
