import { TestBed } from '@angular/core/testing';

import { AuthenticationService, Credentials } from './authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FAKE_LOCAL_STORAGE, EMPLOYEE, TOKEN, FAKE_FUNCTION, FAKE_OBJECT_REF, EMPLOYEE_DETAILS } from './test.constants';
import { AppConfig } from './app.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let snackBarSpy: {};
  let httpMock;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    spyOn(localStorage, 'getItem').and.callFake(FAKE_LOCAL_STORAGE.getItem);
    spyOn(localStorage, 'setItem').and.callFake(FAKE_LOCAL_STORAGE.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(FAKE_LOCAL_STORAGE.removeItem);
    spyOn(localStorage, 'clear').and.callFake(FAKE_LOCAL_STORAGE.clear);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      providers: [
        AuthenticationService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login employee', () => {
    jasmine.createSpy('FAKE_OBJECT_REF');

    service.login({ username: "nk", password: "1234" }, FAKE_FUNCTION, FAKE_OBJECT_REF);

    const req = httpMock.expectOne(`${AppConfig.AUTHENTICATION_API}/login`);
    expect(req.request.method).toBe("POST");
    req.flush({ employeeDetails: EMPLOYEE_DETAILS, token: TOKEN });

    expect(service.employee).toEqual(EMPLOYEE_DETAILS);
    expect(FAKE_LOCAL_STORAGE.getItem(AppConfig.CURRENT_USER_KEY)).toBe(JSON.stringify(EMPLOYEE_DETAILS));
    expect(FAKE_LOCAL_STORAGE.getItem(AppConfig.JWT_TOKEN_KEY)).toBe(TOKEN);
  });

  it('should logout employee', () => {
    FAKE_LOCAL_STORAGE.setItem(AppConfig.CURRENT_USER_KEY, JSON.stringify(EMPLOYEE_DETAILS));
    FAKE_LOCAL_STORAGE.setItem(AppConfig.JWT_TOKEN_KEY, TOKEN);

    expect(FAKE_LOCAL_STORAGE.getItem(AppConfig.CURRENT_USER_KEY)).toBe(JSON.stringify(EMPLOYEE_DETAILS));
    expect(FAKE_LOCAL_STORAGE.getItem(AppConfig.JWT_TOKEN_KEY)).toBe(TOKEN);

    service.logout();

    expect(service.employee).toBeNull();
    expect(FAKE_LOCAL_STORAGE.getItem(AppConfig.JWT_TOKEN_KEY)).toBeNull();
  });
});
