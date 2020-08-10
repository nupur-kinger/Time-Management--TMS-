package com.tms.vo;

import java.io.Serializable;

public class ResetPasswordVO implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private int employeeId;
	private String currentPassword;
	private String newPassword;
	
	public int getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(int employeeId) {
		this.employeeId = employeeId;
	}
	public String getCurrentPassword() {
		return currentPassword;
	}
	public void setCurrentPassword(String currentPassword) {
		this.currentPassword = currentPassword;
	}
	public String getNewPassword() {
		return newPassword;
	}
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

}
