package com.tms.service.helper;

import com.sun.jersey.api.NotFoundException;
import com.tms.hibernate.model.Employee;

/**
 * Helper class to provide static methods to help with authorization.
 */
public final class AuthorizationHelper {
	private static int ADMIN_ROLE_ID = 1;
	private static int MANAGER_ROLE_ID = 2;
	
	public static boolean isAdmin(Employee employee) {
		return employee.getRole() == ADMIN_ROLE_ID;
	}
	
	public static boolean isManager(Employee employee) {
		return employee.getRole() == MANAGER_ROLE_ID;
	}
	
	public static boolean isManager(Employee employee, Employee manager) {
		return isManager(manager) && employee.getReportingTo() == manager.getEmployeeId();
	}
	
	public static void currentEmployeeNotFound(int currentEmployeeId) {
		throw new NotFoundException(String.format("Logged in employee %s not found", currentEmployeeId));
	}
}
