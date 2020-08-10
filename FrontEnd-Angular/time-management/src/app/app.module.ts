import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonModule, DatePipe } from '@angular/common';
import { AddTaskComponent } from './add-task/add-task.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { NavListComponent } from './home/navigate/nav-list/nav-list.component';
import { HeaderComponent } from './home/navigate/header/header.component';
import { TaskListComponent } from './task-list/task-list.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { JwtInterceptor } from './jwt.interceptor';
import { TaskComponent } from './task/task.component';
import { EmployeeComponent } from './employee/employee.component';
import * as moment from 'moment';
import { SetPreferredTimingsDialogComponent } from './set-preferred-timings-dialog/set-preferred-timings-dialog.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatProgressSpinnerModule, MatProgressSpinner, MatSpinner } from '@angular/material/progress-spinner';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AuthGuardService } from './auth/auth.guard.service';
import { AccessDeniedComponentComponent } from './access-denied-component/access-denied-component.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { LoginGuardService } from './auth/login.guard.service';
import { SanitizeValidator } from './sanitize.validator';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuardService] },
  { path: 'register', component: UserRegistrationComponent},
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService], children: [
    { path: 'taskList', component: TaskListComponent },
    { path: 'employeeList/taskList/:id', component: TaskListComponent },
    { path: 'employeeList', component: EmployeeListComponent },
    { path: 'addTask', component: AddTaskComponent },
    { path: 'editTask', component: EditTaskComponent },
    { path: 'addEmployee', component: AddEmployeeComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'resetPassword', component: ResetPasswordComponent},
    { path: '**', component: TaskListComponent },
 ]},
  { path: '404', component: PageNotFoundComponent },
  { path: '401', component: AccessDeniedComponentComponent },
  
  // Wildcard path to redirect to page not found
  { path: '**', redirectTo: '/404'}
];

@NgModule({
  declarations: [
    AppComponent,
    AccessDeniedComponentComponent,
    LoginComponent,
    HomeComponent,
    AddTaskComponent,
    AddEmployeeComponent,
    NavListComponent,
    HeaderComponent,
    TaskListComponent,
    EmployeeListComponent,
    EditTaskComponent,
    DeleteConfirmationDialogComponent,
    EditEmployeeComponent,
    UserRegistrationComponent,
    TaskComponent,
    EmployeeComponent,
    SetPreferredTimingsDialogComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    PageNotFoundComponent,
    SanitizeValidator,
    ResetPasswordComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTableExporterModule,
    MatToolbarModule,
    NgxMaterialTimepickerModule,
    OverlayModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    CommonModule,
  ],
  providers: [
    AuthGuardService,
    LoginGuardService,
    MatDatepickerModule,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditEmployeeComponent,
    DeleteConfirmationDialogComponent,
    SetPreferredTimingsDialogComponent,
    MatSpinner,
  ]
})
export class AppModule { 
  constructor() {
    this.overrideDateFormatting();
  }

  overrideDateFormatting() {
    Date.prototype.toJSON = function(){ return moment(this).format(); }
  }
}
