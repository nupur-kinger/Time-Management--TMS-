import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskComponent } from './task.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from '../authentication.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Task } from '../shared/task.model';
import { EMPLOYEE } from '../test.constants';
import { Employee } from '../shared/employee.model';
import { By } from '@angular/platform-browser';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let authServiceSpy: AuthenticationService;
  let snackBarSpy: {};
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['storeEmployee']);

    TestBed.configureTestingModule({
      declarations: [ TaskComponent, TestHostComponent ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule, 
        FormsModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(TaskComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  it('should create', () => {
    expect(testHostComponent).toBeTruthy();
  });

  it('should contain task description element', () => {
    const descElement = testHostFixture.debugElement.query(By.css('#desc'));
    expect(descElement).toBeTruthy();
  });

  @Component({
    selector: `host-component`,
    template: `
      <task [taskDetails]="task" [isEdit]="false" [close]="close" [employee]="employee"></task>
    `
  })
  class TestHostComponent {
    task: Task = new Task();
    employee: Employee = EMPLOYEE;
  }
});
