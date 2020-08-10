import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import { AuthenticationService } from '../authentication.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { StateService } from '../state.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let authServiceSpy: AuthenticationService;
  let snackBarSpy: {};
  let matDialogSpy: {};
  let stateServiceSpy: {};

  beforeEach(async(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['storeEmployee']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    stateServiceSpy = jasmine.createSpyObj('StateService', ['employee']);

    TestBed.configureTestingModule({
      declarations: [ TaskListComponent ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule, 
        FormsModule,
      ],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: StateService, useValue: stateServiceSpy },
        { provide: ActivatedRoute, useValue: { params: of({id: 123})} },
        DatePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
