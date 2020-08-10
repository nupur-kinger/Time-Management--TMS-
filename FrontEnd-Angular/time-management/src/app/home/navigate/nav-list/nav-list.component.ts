import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.css']
})
export class NavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  public canManageEmployees() {
    const role = this.authenticationService.role;
    return role === 1 || role === 2;
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
}
