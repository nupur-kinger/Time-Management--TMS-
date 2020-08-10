import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../shared/employee.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  close: Function = () => this.dialogRef.close();
  
  constructor(private httpClient: HttpClient,
    private dialogRef: MatDialogRef<AddEmployeeComponent>) { }

  ngOnInit(): void {}
}
