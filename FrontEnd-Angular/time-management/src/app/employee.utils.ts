export interface SelectOption {
    value: string | number;
    viewValue: string;
}

export class Manager {
    id: number;
    name: string;
}

export class Options {
    public genders: SelectOption[] = [
        {value: 'M', viewValue: 'Male'},
        {value: 'F', viewValue: 'Female'},
        {value: 'O', viewValue: 'Other'}
    ];

    public roles: SelectOption[] = [
        {value: '1', viewValue: 'Admin'},
        {value: '2', viewValue: 'Manager'},
        {value: '3', viewValue: 'Employee'}
    ]
}

export const PASSWORD_REGEX = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}';