import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPreferredTimingsDialogComponent } from './set-preferred-timings-dialog.component';
import { AuthenticationService } from '../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

describe('SetPreferredTimingsDialogComponent', () => {
  let component: SetPreferredTimingsDialogComponent;
  let fixture: ComponentFixture<SetPreferredTimingsDialogComponent>;
  let authServiceSpy: AuthenticationService;
  let snackBarSpy: { };
  let matDialogRefSpy: {};

  beforeEach(async(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['employee', 'storeEmployee'])
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ SetPreferredTimingsDialogComponent ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule, 
        FormsModule,
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy }, 
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPreferredTimingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
