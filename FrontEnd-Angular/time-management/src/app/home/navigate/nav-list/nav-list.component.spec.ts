import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavListComponent } from './nav-list.component';
import { AuthenticationService } from 'src/app/authentication.service';
import { FAKE_AUTH_SERVICE } from 'src/app/test.constants';

describe('NavListComponent', () => {
  let component: NavListComponent;
  let fixture: ComponentFixture<NavListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavListComponent ],
      providers: [
        { provide: AuthenticationService, useValue: FAKE_AUTH_SERVICE }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow managing employees', () => {
    expect(component.canManageEmployees()).toBeTrue();
  })

  it('should emit on sidenav close', () => {
    spyOn(component.sidenavClose, 'emit');

    component.onSidenavClose();
    expect(component.sidenavClose.emit).toHaveBeenCalled();
  })
});
