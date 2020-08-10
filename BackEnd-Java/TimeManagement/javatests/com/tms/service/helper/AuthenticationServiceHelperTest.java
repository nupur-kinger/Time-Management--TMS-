package com.tms.service.helper;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import org.junit.Assert;
import org.junit.Test;

import com.tms.hibernate.model.Employee;

public class AuthenticationServiceHelperTest {

	@Test
	public void shouldReturnEmployeeOnSuccessfulLogin() throws NoSuchAlgorithmException, InvalidKeySpecException {
		Employee loggedInEmployee = AuthenticationServiceHelper.login("admin", "1234567");
		assertNotNull(loggedInEmployee);
	}
	
	@Test
	public void shouldReturnNullOnUnsuccessfulLogin() throws NoSuchAlgorithmException, InvalidKeySpecException {
		Employee loggedInEmployee = AuthenticationServiceHelper.login("admin", "admin");
		assertNull(loggedInEmployee);
	}
	
	@Test
	public void shouldNotIncludePasswordInDetails() throws NoSuchAlgorithmException, InvalidKeySpecException {
		Employee loggedInEmployee = AuthenticationServiceHelper.login("admin", "1234567");
		Assert.assertEquals(loggedInEmployee.getPassword(), null);
	}
}
