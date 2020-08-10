package com.tms.vo;

import java.io.Serializable;

public class EmployeeTokenVO implements Serializable {
	private static final long serialVersionUID = 1L;
	private String token;
	private EmployeeDetails employeeDetails;
	
	public EmployeeTokenVO (EmployeeDetails employeeDetails, String token) {
		this.token = token;
		this.employeeDetails = employeeDetails;
	}

	public EmployeeDetails getEmployeeDetails() {
		return employeeDetails;
	}

	public void setEmployeeDetails(EmployeeDetails employeeDetails) {
		this.employeeDetails = employeeDetails;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
}