import { Employee, EmployeeDetails } from "./shared/employee.model";
import { Manager } from './employee.utils';
import { Observable, of } from 'rxjs';
import { Task } from './shared/task.model';

export const TASK: Task = {
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    task: 'Appreciation sheet',
    notes: 'In progress',
    taskId: 2,
    employeeId: 102
}

export const EMPLOYEE: Employee = {
    address: null,
    dateOfBirth: null,
    designation: null,
    email: "nupur.2706@gmail.com",
    employeeId: 5,
    endTime: new Date("2008-01-01T09:00:01+07:00"),
    firstName: "Nupur",
    gender: "F",
    lastName: "Kinger",
    middleName: "K",
    password: "",
    phone: "4334545",
    project: null,
    reportingTo: "Meena",
    role: 2,
    startTime: new Date("2008-01-01T00:00:01+07:00"),
    username: "nknknk"
}

export const EMPLOYEE_DETAILS: EmployeeDetails = {
    address: null,
    dateOfBirth: null,
    designation: null,
    email: "nupur.2706@gmail.com",
    employeeId: 5,
    endTime: new Date("2008-01-01T09:00:01+07:00"),
    firstName: "Nupur",
    gender: "F",
    lastName: "Kinger",
    middleName: "K",
    password: "",
    phone: "4334545",
    project: null,
    reportingTo: "Meena",
    role: 2,
    startTime: new Date("2008-01-01T00:00:01+07:00"),
    username: "nknknk",
    manager: "Priyank"
}

let store = {};
export const FAKE_LOCAL_STORAGE = {
    getItem: (key: string): string => {
        return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
        store[key] = `${value}`;
    },
    removeItem: (key: string) => {
        delete store[key];
    },
    clear: () => {
        store = {};
    }
};

export const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJua25rbmsiLCJhdWQiOiJUTVMtQW5ndWxhciIsImlzcyI6IlRNUyIsImlhdCI6MTU5NDk1NTQ-MH0.ojvZ27TsYvxsU5dUO9mf2WT0yJgTvvJud-uSp9-3ic";

export class MockAuthenticationService {
    employee = EMPLOYEE;
    role = 2;
};

export const FAKE_AUTH_SERVICE = {
    employee: EMPLOYEE,
    role: 2
}

export const managers: Manager[] = [
    { id: 1, name: 'Nupur Kinger' },
    { id: 2, name: 'vg' },
    { id: 1, name: 'Nupdafasger' },
    { id: 1, name: 'dddr Kinger' },
    { id: 1, name: 'Nup67hhgjdghd' },
    { id: 1, name: 'dddddd' },
    { id: 1, name: 'tgtgtgttg' },
];

export const FAKE_OBJECT_REF = {
}

export const FAKE_FUNCTION = (objRef: any) => {
    objRef.string;
}

export class FakeAuthenticationService {
    employee = EMPLOYEE_DETAILS;
    role = 2;
    employeeObservable: Observable<Employee> = of();
    isLoggedIn = () => { return true; };
    inProgressObservable: Observable<boolean> = of(true);
};