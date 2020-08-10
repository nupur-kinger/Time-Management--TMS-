package com.tms.service;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;

import com.tms.hibernate.model.Employee;
import com.tms.security.PasswordUtility;
import com.tms.security.jwt.JwtParseFilter;
import com.tms.service.helper.EmployeeServiceHelper;
import com.tms.vo.EmployeeDetails;
import com.tms.vo.ResetPasswordVO;

@Path("/employee")
public class EmployeeService {
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/get")
	public EmployeeDetails get(@QueryParam("e") int employeeId, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		return EmployeeServiceHelper.get(employeeId, currentEmployeeId);
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getAll")
	public List<EmployeeDetails> getAll(@Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		return EmployeeServiceHelper.getAll(currentEmployeeId);
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getAllReportings")
	public List<EmployeeDetails> getAllReportingTo(@QueryParam("mid") int managerId, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		return EmployeeServiceHelper.getAllReportingTo(managerId, currentEmployeeId);
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getAllManagers")
	public List<Employee> getAllManagers() {
		return EmployeeServiceHelper.getAllManagers();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/isUsernameAvailable")
	public boolean isUsernameAvailable(@QueryParam("u") String username) {
		return EmployeeServiceHelper.isUsernameAvailable(username);
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/register")
	public EmployeeDetails register(Employee employee) throws NoSuchAlgorithmException, InvalidKeySpecException {
		employee.setPassword(PasswordUtility.generate(employee.getPassword()));
		return EmployeeServiceHelper.register(employee);
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/add")
	public EmployeeDetails add(Employee employee, @Context HttpHeaders headers)
			throws NoSuchAlgorithmException, InvalidKeySpecException {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		employee.setPassword(PasswordUtility.generate(employee.getPassword()));
		return EmployeeServiceHelper.addNew(employee, currentEmployeeId);
	}

	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/update")
	public EmployeeDetails update(Employee employee, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		return EmployeeServiceHelper.update(employee, currentEmployeeId);
	}

	@DELETE
	@Path("/delete")
	public void delete(@QueryParam("t") int employeeId, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		EmployeeServiceHelper.delete(employeeId, currentEmployeeId);
	}

	@POST
	@Path("/resetPassword")
	public void resetPassword(ResetPasswordVO resetPasswordDetails, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		EmployeeServiceHelper.resetPassword(resetPasswordDetails.getEmployeeId(),
				resetPasswordDetails.getCurrentPassword(), resetPasswordDetails.getNewPassword(), currentEmployeeId);
	}
}
