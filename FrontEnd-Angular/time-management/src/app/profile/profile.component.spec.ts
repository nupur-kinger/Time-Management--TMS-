import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { AuthenticationService } from '../authentication.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceSpy: AuthenticationService;

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['refreshEmployee', 'employee']);
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
