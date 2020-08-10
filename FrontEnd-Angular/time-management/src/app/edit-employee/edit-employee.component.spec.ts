import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeComponent } from './edit-employee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMPLOYEE_DETAILS } from '../test.constants';

describe('EditEmployeeComponent', () => {
  let component: EditEmployeeComponent;
  let fixture: ComponentFixture<EditEmployeeComponent>;
  let matDialogRefSpy: {};

  beforeEach(async(() => {
    matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [ EditEmployeeComponent ],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy }, 
        { provide: MAT_DIALOG_DATA, useValue: EMPLOYEE_DETAILS },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
