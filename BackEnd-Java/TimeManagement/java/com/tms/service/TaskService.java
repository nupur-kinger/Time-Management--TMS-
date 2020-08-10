package com.tms.service;

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

import com.tms.hibernate.model.Task;
import com.tms.security.jwt.JwtParseFilter;
import com.tms.service.helper.TaskServiceHelper;
import com.tms.vo.DailyTimes;

@Path("/task")
public class TaskService {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/get")
	public Task get(@QueryParam("t") int taskId, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		return TaskServiceHelper.get(taskId, currentEmployeeId);
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getAll")
	public List<Task> getForEmployee(@QueryParam("e") int empId, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		return TaskServiceHelper.getEmployeeTasks(empId, currentEmployeeId);
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getTimes")
	public List<DailyTimes> getDailyTimesForEmployee(@QueryParam("e") int empId, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		return TaskServiceHelper.getEmployeeWorkTimes(empId, currentEmployeeId);
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/add")
	public Task add(Task task, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		return TaskServiceHelper.addNew(task, currentEmployeeId);
	}
	
	@PUT
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/update")
	public Task update(Task task, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		return TaskServiceHelper.update(task, currentEmployeeId);
	}
	
	@DELETE
	@Path("/delete")
	public void delete(@QueryParam("t") int taskId, @Context HttpHeaders headers) {
		int currentEmployeeId = JwtParseFilter.getEmployeeId(headers);
		TaskServiceHelper.delete(taskId, currentEmployeeId);
	}
}
