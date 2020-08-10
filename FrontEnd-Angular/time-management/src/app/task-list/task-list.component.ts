import { Component, OnInit, ViewChild } from '@angular/core';
import { Task } from '../shared/task.model';
import { AppConfig } from '../app.config';
import { HttpParams, HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AuthenticationService } from '../authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DatePipe } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { DailyTime } from '../daily-time.model';
import { map, takeUntil, take } from 'rxjs/operators';
import { SetPreferredTimingsDialogComponent } from '../set-preferred-timings-dialog/set-preferred-timings-dialog.component';
import { Employee } from '../shared/employee.model';
import { StateService } from '../state.service';

class TaskRow extends Task {
  hasPreferredTimes: boolean;
}

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  employeeId: number;
  employee: Employee;
  tasks: Task[];
  columnsToDisplay: string[] = ['date', 'time', 'task', 'notes', 'actions'];
  dataSource: MatTableDataSource<TaskRow>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  range: FormGroup;
  matcher = new MyErrorStateMatcher();
  isFiltered: boolean = false;
  workFrom: Date;
  workTo: Date;

  constructor(private httpClient: HttpClient,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private stateService: StateService,
    private route: ActivatedRoute) {
    this.range = this.formBuilder.group({
      from: new FormControl(),
      to: new FormControl()
    }, { validator: this.checkDates });
  }

  checkDates(group: FormGroup) {
    let errorState: {
      hasFromDateError: boolean;
      hasToDateError: boolean;
    };
    if (group.controls.to.hasError('matDatepickerParse')) {
      errorState.hasToDateError = true;
    }

    return errorState;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (params: ParamMap) => {
        this.employeeId = +params.get('id');
        if (this.employeeId) {
          this.employee = this.stateService.employee;
        }
      }
    )

    this.authenticationService.employeeObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(empDetails => {
      if (empDetails == null) return;
      this.setWorkHours();
      this.refreshData();
    });
  }

  setWorkHours() {
    this.workFrom = this.getEmployee().startTime;
    this.workTo = this.getEmployee().endTime;
  }

  refreshData() {
    forkJoin(
      this.getAllTasks(),
      this.getDailyTimes()
    ).pipe(
      map(([tasks, dailyTimes]) => {
        let rows: TaskRow[] = new Array();
        this.tasks = tasks;

        if (tasks.length == 0) {
          return;
        }

        let i = 0;
        let date = dailyTimes[i].date;
        let hasPreferredTimes = dailyTimes[i].hasPreferredTimes;

        tasks.forEach(task => {
          if (task.date !== date) {
            i++;
            date = dailyTimes[i].date;
            hasPreferredTimes = dailyTimes[i].hasPreferredTimes;
          }
          let row = new TaskRow();
          row.taskId = task.taskId;
          row.date = new Date(task.date);
          row.date.setHours(0, 0, 0, 0);
          row.startTime = task.startTime;
          row.endTime = task.endTime;
          row.task = task.task;
          row.notes = task.notes;
          row.hasPreferredTimes = hasPreferredTimes;

          rows.push(row);
        });

        return rows;
      })).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(rows => {
        this.dataSource = new MatTableDataSource<TaskRow>(rows);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data, filter) => {
          if (this.fromDate && this.toDate) {
            return data.date >= this.fromDate && data.date <= this.toDate;
          }
          return true;
        }
        this.range.reset();
        this.isFiltered = false;
      }, error => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          console.error(`Backend returned code ${error.status}`);
          this.openSnackBar(AppConfig.BACKEND_ERROR_MESSAGE);
        }
      });
  }

  getEmployee() {
    if (this.employee) {
      return this.employee;
    }
    return this.authenticationService.employee;
  }

  getAllTasks() {
    return this.httpClient.get<Task[]>(`${AppConfig.TASK_API}/getAll`, {
      params: new HttpParams().set('e', this.getEmployee().employeeId.toString(10))
    })
  }

  getDailyTimes() {
    return this.httpClient.get<DailyTime[]>(`${AppConfig.TASK_API}/getTimes`, {
      params: new HttpParams().set('e', this.getEmployee().employeeId.toString(10))
    })
  }

  get fromDate() { return this.range.get('from').value; }
  get toDate() { return this.range.get('to').value; }
  get filename(): string {
    let filename = "Task-List";
    if (!this.isFiltered) {
      return filename;
    }

    let from = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    let to = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    return from != null && to != null ? `${filename} ${from} to ${to}` : filename;
  }

  applyFilter() {
    this.dataSource.filter = '' + Math.random();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.isFiltered = true;
  }

  addTaskDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.getEmployee();

    let dialogRef = this.dialog.open(AddTaskComponent, dialogConfig);
    dialogRef.afterClosed().pipe(take(1)).subscribe(() => this.refreshData());
  }

  edit(task: Task) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      "employee": this.getEmployee(),
      "task": task
    }
    let dialogRef = this.dialog.open(EditTaskComponent, dialogConfig);
    dialogRef.afterClosed().pipe(take(1)).subscribe(() => this.refreshData());
  }

  delete(taskId: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, { data: "Delete Task" });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.httpClient.delete(`${AppConfig.TASK_API}/delete`, {
          params: new HttpParams().set('t', taskId.toString(10))
        }).pipe(take(1))
          .subscribe(
            data => {
              this.openSnackBar("Task deleted !");
              this.refreshData();
            },
            error => {
              if (error.error instanceof Error) {
                // A client-side or network error occurred. Handle it accordingly.
                console.error('An error occurred:', error.error.message);
              } else {
                // The backend returned an unsuccessful response code.
                console.error(`Backend returned code ${error.status}`);
                this.openSnackBar(AppConfig.BACKEND_ERROR_MESSAGE);
              }
            });
      }
    });
  }

  editWorkHours() {
    const dialogRef = this.dialog.open(SetPreferredTimingsDialogComponent);
    dialogRef.afterClosed().pipe(take(1)).subscribe(() => this.refreshData);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  private ngUnsubscribe = new Subject();
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid);
    const invalidParent = !!(control && control.parent && control.parent.invalid);

    return (invalidCtrl || invalidParent);
  }
}
