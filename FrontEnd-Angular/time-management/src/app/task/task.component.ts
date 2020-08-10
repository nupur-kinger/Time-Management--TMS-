import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Task } from '../shared/task.model';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '../shared/employee.model';
import { AuthenticationService } from '../authentication.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  form: FormGroup;
  @Input() taskDetails: Task;
  @Input() isEdit: boolean;
  @Input() close: any;
  @Input() employee: Employee;

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      date: new FormControl(this.taskDetails.date, Validators.required),
      startTime: new FormControl(this.taskDetails.startTime, Validators.required),
      endTime: new FormControl(this.taskDetails.endTime, Validators.required),
      task: new FormControl(this.taskDetails.task, Validators.required),
      notes: new FormControl(this.taskDetails.notes),

    });

    this.setTimes();
  }

  setTimes() {
    if (this.isEdit) {
      //Setting values from task object        
      this.form.controls['endTime'].setValue(new Date(this.taskDetails.endTime));
      this.form.controls['startTime'].setValue(new Date(this.taskDetails.startTime));
    } else {
      // setting default values of time
      this.form.controls['endTime'].setValue(new Date(this.employee.endTime));
      this.form.controls['startTime'].setValue(new Date(this.employee.startTime));
    }
  }

  onSave(task: Task) {
    if (this.form.valid) {
      task.employeeId = this.getEmployee().employeeId;

      if (this.isEdit) {
        this.updateTask(task);
      } else {
        this.addTask(task);
      }
    }
  }

  formatTimes(task: Task): void {
    let start: string = String(task.startTime);
    let end: string = String(task.endTime);

    let startTime = start.split(":");
    let endTime = end.split(":");

    task.startTime = new Date(task.date);
    task.startTime.setHours(+startTime[0], +startTime[1]);

    task.endTime = new Date(task.date);
    task.endTime.setHours(+endTime[0], +endTime[1]);

    task.date.setHours(0, 0, 0, 0);
  }

  addTask(task: Task) {
    this.httpClient
      .post<Task>(`${AppConfig.TASK_API}/add`, task)
      .pipe(take(1))
      .subscribe(
        data => {
          this.openSnackBar("Task saved successfully !");
          this.close();
        },
        error => {
          if (error.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            console.error(`Backend returned code ${error.status}`);
            this.openSnackBar(error.status === 400 ? error.error : AppConfig.BACKEND_ERROR_MESSAGE);
          }
        });
  }

  updateTask(task: Task) {
    task.taskId = this.taskDetails.taskId;
    this.httpClient.put<Task>(`${AppConfig.TASK_API}/update`, task)
      .pipe(take(1))
      .subscribe(
        data => {
          this.openSnackBar("Task updated successfully !");
          this.close();
        },
        error => {
          if (error.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
          } else {
            // The backend returned an unsuccessful response code.
            console.error(`Backend returned code ${error.status}`);
            this.openSnackBar(error.status === 400 ? error.error : AppConfig.BACKEND_ERROR_MESSAGE);
          }
        });
  }

  onReset() {
    this.form.reset();
    this.setTimes();
    this.form.controls['date'].setValue(this.taskDetails.date);
  }

  onCancel() {
    this.close();
  }

  showReset() {
    return !this.isEdit;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  getEmployee() {
    if (this.employee) {
      return this.employee;
    }
    return this.authenticationService.employee;
  }
}
