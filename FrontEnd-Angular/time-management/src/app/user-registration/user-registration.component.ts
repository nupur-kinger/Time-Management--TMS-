import { Component, OnInit } from '@angular/core';
import { SelectOption } from '../employee.utils';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../shared/employee.model';
import { AppConfig } from '../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  close: Function = () => {
    this.router.navigate(['login']);
  };
  
  constructor(private httpClient: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
  }
}
