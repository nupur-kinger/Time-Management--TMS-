import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../authentication.service';
import { FAKE_AUTH_SERVICE, FakeAuthenticationService } from '../test.constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';

class MockOverlay {
  position() {
    return this;
  }

  global() {
    return this;
  }

  centerHorizontally() {
    return this;
  }

  centerVertically() {
    return this;
  }

  create() {
    return this;
  }
  
  attach() {
    return this;
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let snackBarSpy: {};
  let overlaySpy: {};

  beforeEach(async(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    // overlaySpy = jasmine.createSpyObj('Overlay', ['position']);

    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthenticationService, useValue: new FakeAuthenticationService() },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Overlay, useClass: MockOverlay },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
