import { Component, OnInit, Inject } from '@angular/core';
import { Task } from '../shared/task.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AppConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../shared/employee.model';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  employee: Employee;
  task: Task = new Task();
  close: Function = () => {
    this.dialogRef.close();
  }

  constructor(private httpClient: HttpClient,
    private dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public emp: Employee) {
      this.employee = emp;
    }

  ngOnInit(): void {
    this.task.date = new Date();
  }
}
