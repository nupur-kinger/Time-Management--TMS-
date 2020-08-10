import { Component, OnInit, Input, SecurityContext } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Employee, EmployeeDetails } from '../shared/employee.model';
import { AppConfig } from '../app.config';
import { SelectOption, Manager, PASSWORD_REGEX } from '../employee.utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  form: FormGroup;
  // filteredOptions: Observable<Manager[]>;
  isUsernameValid: boolean = true;
  actionInProgress: boolean = false;

  @Input() empDetails: EmployeeDetails;
  @Input() isEdit: boolean;
  @Input() signup: boolean;
  @Input() close: any;
  genders: SelectOption[] = [
    { value: 'M', viewValue: 'Male' },
    { value: 'F', viewValue: 'Female' },
    { value: 'O', viewValue: 'Other' }
  ];

  roles: SelectOption[] = [
    { value: 1, viewValue: 'Admin' },
    { value: 2, viewValue: 'Manager' },
    { value: 3, viewValue: 'Employee' }
  ]

  managers: Manager[] = new Array<Manager>();

  constructor(private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.getAllManagers();
    let newEmp: boolean = false;
    if (this.empDetails === undefined) {
      this.empDetails = new EmployeeDetails();
      newEmp = true;
    }

    let role: FormControl = this.signup == true
      ? new FormControl({ value: 3, disabled: true }, Validators.required)
      : new FormControl(this.empDetails.role, Validators.required);

    this.form = new FormGroup({
      employeeId: new FormControl(this.empDetails.employeeId),
      firstName: new FormControl(this.empDetails.firstName, [Validators.required]),
      middleName: new FormControl(this.empDetails.middleName),
      lastName: new FormControl(this.empDetails.lastName, [Validators.required]),
      username: new FormControl(this.empDetails.username, [Validators.required], this.usernameValidator.bind(this)),
      password: new FormControl(this.empDetails.password, [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
      gender: new FormControl(this.empDetails.gender, Validators.required),
      dateOfBirth: new FormControl(this.empDetails.dateOfBirth, Validators.required),
      role: role,
      designation: new FormControl(this.empDetails.designation, Validators.required),
      email: new FormControl(this.empDetails.email, [Validators.required, Validators.email]),
      phone: new FormControl(this.empDetails.phone, [Validators.required, Validators.pattern("[0-9]{10}$")]),
      address: new FormControl(this.empDetails.address, Validators.required),
      project: new FormControl(this.empDetails.project, Validators.required),
      reportingTo: new FormControl(this.empDetails.reportingTo, Validators.required),
      startTime: new FormControl(this.empDetails.startTime),
      endTime: new FormControl(this.empDetails.endTime)
    });

    // this.filteredOptions = reportingTo.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => typeof value === 'string' ? value : value.name),
    //     map(name => name ? this.filter(name) : this.managers.slice())
    //   );
  }

  get email() { return this.form.get('email'); }
  get phone() { return this.form.get('phone'); }
  get isManagerOrAdmin() { return this.authenticationService.role == 1 || this.authenticationService.role == 2; }

  onSave(employee: Employee) {
    this.actionInProgress = true;
    let isFormValid = true;
    if (this.form.invalid) {
      const controls = this.form.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          if ((name === 'username' || name === 'password')) {
            isFormValid = this.signup ? false : isFormValid;
          } else {
            isFormValid = false;
          }
        }
      }
    }

    if (isFormValid) {
      employee.dateOfBirth = new Date(employee.dateOfBirth);
      if (this.isEdit) {
        this.updateEmployee(employee);
      } else {
          this.addEmployee(employee);
      }
    } else {
      this.actionInProgress = false;
    }
  }

  addEmployee(employee: Employee) {
    const url = this.signup ? `${AppConfig.EMPLOYEE_API}/register` : `${AppConfig.EMPLOYEE_API}/add`;

    this.httpClient.post<EmployeeDetails>(url, employee)
      .pipe(take(1))
      .subscribe(
        data => {
          if (this.signup) {
            this.openSnackBar("Your details have been saved. Please login.");
            this.router.navigate(['login']);
          } else {
            this.openSnackBar("Employee details saved successfully !");
            this.close();
          }
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

  updateEmployee(employee: Employee) {
    this.httpClient.put<EmployeeDetails>(`${AppConfig.EMPLOYEE_API}/update`, employee)
      .pipe(take(1))
      .subscribe(
        data => {
          this.openSnackBar("Employee details saved successfully !");
          this.close();
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

  getAllManagers() {
    this.httpClient.get<Employee[]>(`${AppConfig.EMPLOYEE_API}/getAllManagers`)
      .pipe(take(1))
      .subscribe(
        (data: Employee[]) => {
          data.forEach(emp => this.managers.push({ id: emp.employeeId, name: emp.firstName }));
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

  onReset() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    if (this.signup) {
      this.form.controls.role.setValue('3');
    }
  }

  onCancel() {
    this.close();
  }

  showReset() {
    return !this.isEdit;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  // displayFn(manager: Manager): string {
  //   return manager && manager.name ? manager.name : '';
  // }

  // filter(name: string): Manager[] {
  //   const filterValue = name.toLowerCase();
  //   return this.managers.filter(manager => manager.name.toLowerCase().indexOf(filterValue) === 0);
  // }

  usernameValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (this.form === undefined) return of(null);

    let username: string = this.form.controls['username'].value;

    return this.httpClient.get<boolean>(`${AppConfig.EMPLOYEE_API}/isUsernameAvailable`,
      { params: new HttpParams().set('u', username) })
      .pipe(map((isAvailable: boolean) => {
        this.isUsernameValid = isAvailable;
        if (isAvailable) return null;
        return { 'isUsernameAvailable': true };
      }));
  }
}
