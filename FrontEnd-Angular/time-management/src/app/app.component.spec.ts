import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthenticationService } from './authentication.service';
import { MockAuthenticationService, EMPLOYEE, EMPLOYEE_DETAILS, FAKE_LOCAL_STORAGE, FakeAuthenticationService } from './test.constants';
import { EmployeeDetails, Employee } from './shared/employee.model';
import { Observable, of } from 'rxjs';
import { AppConfig } from './app.config';

describe('AppComponent', () => {
  let authenticationService: AuthenticationService;
    
  beforeEach(async(() => {
    spyOn(localStorage, 'getItem').and.callFake(FAKE_LOCAL_STORAGE.getItem);
    
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AuthenticationService, useValue: new FakeAuthenticationService() }
      ]
    }).compileComponents();

    authenticationService = TestBed.inject(AuthenticationService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'time-management'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('time-management');
  });

  it('should have employee logged in', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    FAKE_LOCAL_STORAGE.setItem(AppConfig.IS_LOGGED_IN_KEY, "1");

    app.ngOnInit();
    expect(app.isLoggedIn).toBeTrue();
  })

  it('should have employee logged out', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    FAKE_LOCAL_STORAGE.setItem(AppConfig.IS_LOGGED_IN_KEY, "0");

    app.ngOnInit();
    expect(app.isLoggedIn).toBeFalse();
  })
});
