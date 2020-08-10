import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeComponent } from './employee.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Employee, EmployeeDetails } from '../shared/employee.model';
import { EMPLOYEE, EMPLOYEE_DETAILS, FakeAuthenticationService } from '../test.constants';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../authentication.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let snackBarSpy: {};

  beforeEach(async(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      declarations: [EmployeeComponent, AutocompleteStubComponent, MatInputStubComponent],
      imports: [RouterTestingModule,
        HttpClientTestingModule,
        // MatAutocompleteModule,
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: AuthenticationService, useValue: new FakeAuthenticationService() },
        // { MatAutocomplete }
      ],   
      schemas: [ NO_ERRORS_SCHEMA ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  @Component({selector: 'mat-autocomplete', template: ''}) class AutocompleteStubComponent {}
  @Component({selector: 'mat-input', template: ''}) class MatInputStubComponent {}

  @Component({
    selector: `host-component`,
    template: `
      <employee [isEdit]="true" [close]="close" [empDetails]="employee"></employee>
    `
  })
  class TestHostComponent {
    employee: EmployeeDetails = EMPLOYEE_DETAILS;
    close = () => { };
  }
});
