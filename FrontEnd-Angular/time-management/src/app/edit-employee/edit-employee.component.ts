import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../shared/employee.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConfig } from '../app.config';

@Component({
  selector: 'edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  employee: Employee;
  close: Function = () => this.dialogRef.close();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private httpClient: HttpClient,
    private dialogRef: MatDialogRef<EditEmployeeComponent>) { 
      this.employee = data;
  }

  ngOnInit(): void {}
}
