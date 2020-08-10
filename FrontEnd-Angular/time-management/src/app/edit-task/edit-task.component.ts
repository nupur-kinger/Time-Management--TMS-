import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Task } from '../shared/task.model';
import { AppConfig } from '../app.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../shared/employee.model';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  task: Task;
  close: Function = () => this.dialogRef.close();
  employee: Employee;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {employee: Employee, task: Task},
    private httpClient: HttpClient,
    private dialogRef: MatDialogRef<EditTaskComponent>) { 
      this.task = data.task;
      this.employee = data.employee;
  }

  ngOnInit(): void { }
}
