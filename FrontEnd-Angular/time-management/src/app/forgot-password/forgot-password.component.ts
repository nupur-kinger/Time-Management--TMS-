import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  
  constructor(private httpClient: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(),
    });
  }

  save(form) {
    this.router.navigate(["login"]);
  }
}
