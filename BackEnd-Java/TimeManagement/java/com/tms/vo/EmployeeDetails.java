package com.tms.vo;

import java.io.Serializable;

import com.tms.hibernate.model.Employee;

public class EmployeeDetails extends Employee implements Serializable {
	private static final long serialVersionUID = 1L;
	private String manager;
	
	public EmployeeDetails() {
		
	}
	
	public EmployeeDetails(Employee employee) {
		setEmployeeId(employee.getEmployeeId());
		setFirstName(employee.getFirstName());
		setMiddleName(employee.getMiddleName());
		setLastName(employee.getLastName());
		setUsername(employee.getUsername());
		setGender(employee.getGender());
		setDateOfBirth(employee.getDateOfBirth());
		setAddress(employee.getAddress());
		setPhone(employee.getPhone());
		setRole(employee.getRole());
		setProject(employee.getProject());
		setDesignation(employee.getDesignation());
		setReportingTo(employee.getReportingTo());
		setEmail(employee.getEmail());
		setStartTime(employee.getStartTime());
		setEndTime(employee.getEndTime());
	}
	
	public EmployeeDetails(Employee employee, String managerName) {
		this(employee);
		setManager(managerName);
	}

	public String getManager() {
		return manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}
}
