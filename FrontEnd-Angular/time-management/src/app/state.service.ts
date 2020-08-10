import { Injectable } from '@angular/core';
import { Employee } from './shared/employee.model';

@Injectable({
    providedIn: 'root'
  })
  export class StateService {
      employee: Employee;

      clear() {
          this.employee = null;
      }

      store(employee: Employee) {
          this.employee = employee;
      }
  }