export class Employee {
    readonly employeeId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    role: number;
    designation: string;
    email: string;
    phone: string;
    address: string;
    project: string;
    reportingTo: string;
    username: string;
    password: string;
    startTime: Date;
    endTime: Date;
}

export class EmployeeDetails extends Employee {
    manager: string;
}