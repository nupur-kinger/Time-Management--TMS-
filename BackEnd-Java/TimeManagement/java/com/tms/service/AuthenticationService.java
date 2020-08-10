package com.tms.service;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.tms.security.jwt.JwtIssuer;
import com.tms.service.helper.AuthenticationServiceHelper;
import com.tms.vo.Credentials;
import com.tms.vo.EmployeeDetails;
import com.tms.vo.EmployeeTokenVO;

@Path("/auth")
public class AuthenticationService {
	private static final Logger logger = LogManager.getLogger(AuthenticationService.class);

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/login")
	public EmployeeTokenVO login(Credentials creds) throws NoSuchAlgorithmException, InvalidKeySpecException {
		logger.info("Logging in for user " + creds.getUsername());
		EmployeeDetails employeeDetails = AuthenticationServiceHelper.login(creds.getUsername(), creds.getPassword());
		if (employeeDetails == null) {
			logger.error("No employee found for username " + creds.getUsername());
			return new EmployeeTokenVO(null, null);
		}
		return new EmployeeTokenVO(employeeDetails, JwtIssuer.issueToken(employeeDetails.getEmployeeId()));
	}
}
