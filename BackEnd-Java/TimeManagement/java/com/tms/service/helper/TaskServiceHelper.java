package com.tms.service.helper;

import static com.tms.security.HtmlSanitizationUtils.POLICY;
import static com.tms.exceptions.AbortRequestUtil.abortUnauthorizedRequest;
import static com.tms.hibernate.HibernateUtil.beginTransaction;
import static com.tms.service.helper.AuthorizationHelper.isAdmin;
import static com.tms.service.helper.AuthorizationHelper.isManager;
import static com.tms.service.helper.AuthorizationHelper.currentEmployeeNotFound;
import static com.tms.service.helper.EmployeeServiceHelper.getEmployee;
import static org.apache.commons.text.StringEscapeUtils.unescapeHtml4;
import static java.time.format.DateTimeFormatter.ISO_OFFSET_DATE_TIME;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.query.Query;

import com.tms.hibernate.model.Employee;
import com.tms.hibernate.model.Task;
import com.tms.security.HtmlSanitizationUtils;
import com.tms.vo.DailyTimes;

/**
 * A thin layer to wrap all the hibernate interactions for TASK CRUD.
 */
@SuppressWarnings("unchecked")
public final class TaskServiceHelper {
	private static final Logger logger = LogManager.getLogger(TaskServiceHelper.class);

	private static final String EMP_TASKS_QUERY = "FROM Task t WHERE t.employeeId = :employeeId ORDER BY t.date DESC, t.startTime DESC, t.endTime DESC";
	private static final String TASK_QUERY = "FROM Task t WHERE t.taskId = :taskId";
	private static final String EMP_DAILY_TIMES_QUERY = "SELECT date, min(t.startTime), max(t.endTime) FROM Task t where t.employeeId = :employeeId group by t.date order by t.date desc";

	public static List<Task> getEmployeeTasks(int employeeId, int currentEmployeeId) {
		logger.info("getEmployeeTasks for employee " + employeeId);

		try (Session session = beginTransaction()) {

			// Check authorization
			Employee currentEmployee = EmployeeServiceHelper.getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			if (currentEmployeeId != employeeId) { // Not accessing own records
				Employee employee = EmployeeServiceHelper.getEmployee(employeeId, session);
				if (!isAdmin(currentEmployee) && !isManager(employee, currentEmployee)) {
					logger.error("Aborting request. Current employee id {} does not have permissions.",
							currentEmployeeId);
					abortUnauthorizedRequest("Current employee does not have permissions");
				}
			}

			Query<Task> query = session.createQuery(EMP_TASKS_QUERY);
			query.setParameter("employeeId", employeeId);
			List<Task> tasks = query.list();

			session.getTransaction().commit();

			logger.info("Returning {} tasks.", tasks.size());
			
			return tasks.stream().map(task -> unescapeHtml(task)).collect(Collectors.toList());
		}
	}

	public static List<DailyTimes> getEmployeeWorkTimes(int employeeId, int currentEmployeeId) {
		logger.info("Get work times for employee {}", employeeId);

		try (Session session = beginTransaction()) {

			// Check authorization
			Employee currentEmployee = EmployeeServiceHelper.getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			Employee employee = EmployeeServiceHelper.getEmployee(employeeId, session);
			if (currentEmployeeId != employeeId) { // Not accessing own records
				if (!isAdmin(currentEmployee) && !isManager(employee, currentEmployee)) {
					logger.error("Aborting request. Current employee id {} does not have permissions.",
							currentEmployeeId);
					abortUnauthorizedRequest("Current employee does not have permissions");
				}
			}

			OffsetDateTime startTime = employee.getStartTime();
			OffsetDateTime endTime = employee.getEndTime();

			Query<Object[]> query = session.createQuery(EMP_DAILY_TIMES_QUERY);
			query.setParameter("employeeId", employeeId);
			List<Object[]> rows = query.list();

			session.getTransaction().commit();

			List<DailyTimes> result = new ArrayList<>();
			for (Object[] row : rows) {
				DailyTimes dailyTime = new DailyTimes();
				OffsetDateTime from = OffsetDateTime.parse(row[1].toString(), ISO_OFFSET_DATE_TIME);
				OffsetDateTime to = OffsetDateTime.parse(row[2].toString(), ISO_OFFSET_DATE_TIME);

				dailyTime.setDate(OffsetDateTime.parse(row[0].toString(), ISO_OFFSET_DATE_TIME));
				dailyTime.setFrom(from);
				dailyTime.setTo(to);
				dailyTime.setHasPreferredTimes(isInRange(startTime, endTime, from, to));
				result.add(dailyTime);
			}

			logger.info("Work times found for {} days", result.size());
			return result;
		}
	}

	private static boolean isInRange(OffsetDateTime startTime, OffsetDateTime endTime, OffsetDateTime from,
			OffsetDateTime to) {
		int startHour = startTime.getHour();
		int endHour = endTime.getHour();
		int fromHour = from.getHour();
		int toHour = to.getHour();

		if (fromHour < startHour || fromHour > endHour) {
			return false;
		}

		if (toHour < startHour || toHour > endHour) {
			return false;
		}

		return true;
	}

	public static Task addNew(Task task, int currentEmployeeId) {
		logger.info("Add new task for employee id {}", task.getEmployeeId());
		try (Session session = beginTransaction()) {

			// Check authorization
			Employee currentEmployee = EmployeeServiceHelper.getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			int employeeId = task.getEmployeeId();
			if (currentEmployeeId != employeeId) { // Not accessing own records
				Employee employee = EmployeeServiceHelper.getEmployee(employeeId, session);
				if (!isAdmin(currentEmployee) && !isManager(employee, currentEmployee)) {
					logger.error("Aborting request. Current employee id {} does not have permissions.",
							currentEmployeeId);
					abortUnauthorizedRequest("Current employee does not have permissions");
				}
			}

			int taskId = (Integer) session.save(task);
			Task newTask = getTask(taskId, session);

			sanitizeAndValidate(task);
			session.getTransaction().commit();

			logger.info("New task added with id {}", newTask.getTaskId());
			return newTask;
		}
	}

	public static Task get(int taskId, int currentEmployeeId) {
		logger.info("Get task id {}", taskId);

		try (Session session = beginTransaction()) {

			Query<Task> query = session.createQuery(TASK_QUERY);
			query.setParameter("taskId", taskId);
			Task task = unescapeHtml(query.list().get(0));
			int employeeId = task.getEmployeeId();

			// Check authorization
			Employee currentEmployee = getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			if (currentEmployeeId != employeeId) { // Not accessing own records
				Employee employee = getEmployee(employeeId, session);
				if (!isAdmin(currentEmployee) && !isManager(employee, currentEmployee)) {
					logger.error("Aborting request. Current employee id {} does not have permissions.",
							currentEmployeeId);
					abortUnauthorizedRequest("Current employee does not have permissions");
				}
			}

			session.getTransaction().commit();

			logger.info("Task id {} retreived", task.getTaskId());
			return task;
		}
	}

	public static Task update(Task task, int currentEmployeeId) {
		logger.info("Update task with id {}", task.getTaskId());

		try (Session session = beginTransaction()) {

			// Check authorization
			Employee currentEmployee = getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			int employeeId = task.getEmployeeId();
			if (currentEmployeeId != employeeId) { // Not accessing own records
				Employee employee = getEmployee(employeeId, session);
				if (!isAdmin(currentEmployee) && !isManager(employee, currentEmployee)) {
					logger.error("Aborting request. Current employee id {} does not have permissions.",
							currentEmployeeId);
					abortUnauthorizedRequest("Current employee does not have permissions");
				}
			}

			sanitizeAndValidate(task);
			session.merge(task);
			Task updatedTask = getTask(task.getTaskId(), session);

			session.getTransaction().commit();

			logger.info("Task id {} updated", updatedTask.getTaskId());
			return updatedTask;
		}
	}

	public static void delete(int taskId, int currentEmployeeId) {
		logger.info("Delete task with id {}", taskId);

		try (Session session = beginTransaction()) {

			Task task = getTask(taskId, session);
			int employeeId = task.getEmployeeId();

			// Check authorization
			Employee currentEmployee = getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			if (currentEmployeeId != employeeId) { // Not accessing own records
				Employee employee = getEmployee(employeeId, session);
				if (!isAdmin(currentEmployee) && !isManager(employee, currentEmployee)) {
					logger.error("Aborting request. Current employee id {} does not have permissions.",
							currentEmployeeId);
					abortUnauthorizedRequest("Current employee does not have permissions");
				}
			}

			session.delete(task);

			logger.info("Task id {} deleted", taskId);
			session.getTransaction().commit();
		}
	}

	private static void sanitizeAndValidate(Task task) {
		task.setTask(POLICY.sanitize(task.getTask()));
		if (task.getNotes() != null) {
			task.setNotes(POLICY.sanitize(task.getNotes()));
		}

		List<String> invalidFields = new ArrayList<>();
		if (isNullOrEmpty(task.getTask())) {
			invalidFields.add("Task description");
		}

		HtmlSanitizationUtils.abortRequestForInvalidFields(invalidFields);
	}
	
	private static Task unescapeHtml(Task task) {
		task.setTask(unescapeHtml4(task.getTask()));
		task.setNotes(unescapeHtml4(task.getNotes()));
		return task;
	}

	private static Task getTask(int taskId, Session session) {
		Query<Task> query = session.createQuery(TASK_QUERY);
		query.setParameter("taskId", taskId);
		return unescapeHtml(query.list().get(0));
	}

//	public static void sanitizeAndEncode(Task task) {
//		task.setTask(Encode.forHtmlContent(task.getTask()));
//		if (task.getNotes() != null) {
//			task.setNotes(Encode.forHtmlContent(task.getNotes()));
//		}
//	}

	private static boolean isNullOrEmpty(String str) {
		return str == null || str.isEmpty();
	}
}
