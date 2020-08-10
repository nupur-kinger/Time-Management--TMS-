package com.tms.service.helper;

import static com.tms.exceptions.AbortRequestUtil.abortUnauthorizedRequest;
import static com.tms.security.HtmlSanitizationUtils.POLICY;
import static com.tms.service.helper.AuthorizationHelper.isAdmin;
import static com.tms.service.helper.AuthorizationHelper.isManager;
import static org.apache.commons.text.StringEscapeUtils.unescapeHtml4;
import static com.tms.service.helper.AuthorizationHelper.currentEmployeeNotFound;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.validator.routines.EmailValidator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.query.Query;

import static com.tms.hibernate.HibernateUtil.beginTransaction;

import com.sun.istack.Nullable;
import com.tms.exceptions.AbortRequestUtil;
import com.tms.hibernate.model.Employee;
import com.tms.hibernate.model.Task;
import com.tms.security.HtmlSanitizationUtils;
import com.tms.security.PasswordUtility;
import com.tms.vo.EmployeeDetails;

/**
 * A thin layer to wrap all the hibernate interactions for EMPLOYEE CRUD.
 */
@SuppressWarnings("unchecked")
public final class EmployeeServiceHelper {
	private static final Logger logger = LogManager.getLogger(EmployeeServiceHelper.class);

	private static final String EMP_QUERY = "FROM Employee t WHERE t.employeeId = :employeeId AND t.isValid=1";
	private static final String ALL_EMP_QUERY = "FROM Employee t WHERE t.isValid=1 ORDER BY t.firstName, t.middleName, t.lastName";
	private static final String ALL_MANAGERS_QUERY = "FROM Employee t WHERE t.isValid=1 AND t.role=2 ORDER BY t.firstName, t.middleName, t.lastName";
	private static final String ALL_EMP_REPORTING_TO_QUERY = "FROM Employee t WHERE t.isValid=1 AND t.reportingTo = :reportingTo ORDER BY t.firstName, t.middleName, t.lastName";
	private static final String USERNAME_QUERY = "FROM Employee t WHERE t.username = :username AND t.isValid=1";
	private static final EmailValidator EMAIL_VALIDATOR = EmailValidator.getInstance();
	private static final String PHONE_VALIDATOR_PATTERN = "[0-9]{10}$";

	public static EmployeeDetails get(int employeeId, int currentEmployeeId) {
		logger.info("get employee details for employee " + employeeId);

		try (Session session = beginTransaction()) {

			// Check authorization
			Employee currentEmployee = getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			EmployeeDetails employee = getEmployeeDetails(employeeId, session);
			if (currentEmployeeId != employeeId) { // Not accessing own records
				if (!isAdmin(currentEmployee) && !isManager(employee, currentEmployee)) {
					logger.error("Aborting request. Current employee id {} does not have permissions.",
							currentEmployeeId);
					abortUnauthorizedRequest("Current employee does not have permissions");
				}
			}

			session.getTransaction().commit();

			employee.setPassword("");

			logger.info("Retreived employee details for employee {}", employeeId);
//		return sanitizeAndEncode(employee);
			return employee;
		}
	}

	public static EmployeeDetails register(Employee employee) {
		logger.info("Register new employee");

		// Registration should always be as a normal employee
		employee.setRole(3);

		try (Session session = beginTransaction()) {

			if (!isUsernameAvailable(employee.getUsername())) {
				logger.error("Aborting request. Username is not avaialble.");
				AbortRequestUtil.abortBadRequest("Username not available");
			}

			// Set default start and end working hours
			OffsetDateTime offsetTime = OffsetDateTime.now(ZoneOffset.UTC);
			employee.setStartTime(OffsetDateTime.from(offsetTime).withHour(0).withMinute(00));
			employee.setEndTime(OffsetDateTime.from(offsetTime).withHour(9).withMinute(00));

			employee.setValid(true);
			sanitizeAndValidate(employee);
			int employeeId = (Integer) session.save(employee);
			EmployeeDetails employeeDetails = getEmployeeDetails(employeeId, session);

			session.getTransaction().commit();

			logger.info("Registered new employee {}", employeeId);
//		return sanitizeAndEncode(employeeDetails);
			return employeeDetails;
		}
	}

	public static EmployeeDetails addNew(Employee employee, int currentEmployeeId) {
		logger.info("Add new employee");

		try (Session session = beginTransaction()) {

			// Check authorization
			Employee currentEmployee = getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			if (!isAdmin(currentEmployee) && !isManager(currentEmployee)) {
				logger.error("Aborting request. Current employee id {} does not have permissions.", currentEmployeeId);
				abortUnauthorizedRequest("Current employee does not have permissions");
			}

			if (!isUsernameAvailable(employee.getUsername())) {
				logger.error("Aborting request. Username is not avaialble.");
				AbortRequestUtil.abortBadRequest("Username not available");
			}

			// Set default start and end working hours
			OffsetDateTime offsetTime = OffsetDateTime.now(ZoneOffset.UTC);
			employee.setStartTime(OffsetDateTime.from(offsetTime).withHour(0).withMinute(00));
			employee.setEndTime(OffsetDateTime.from(offsetTime).withHour(9).withMinute(00));

			employee.setValid(true);
			sanitizeAndValidate(employee);
			int employeeId = (Integer) session.save(employee);
			EmployeeDetails employeeDetails = getEmployeeDetails(employeeId, session);

			session.getTransaction().commit();

			logger.info("Added new employee {}", employeeId);
//		return sanitizeAndEncode(employeeDetails);
			return employeeDetails;
		}
	}

	public static List<EmployeeDetails> getAll(int currentEmployeeId) {
		logger.info("get all employees");

		try (Session session = beginTransaction()) {

			// Check authorization
			Employee currentEmployee = getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			if (!isAdmin(currentEmployee)) {
				logger.error("Aborting request. Current employee id {} does not have permissions.", currentEmployeeId);
				abortUnauthorizedRequest("Current employee does not have permissions");
			}

			List<Employee> employees = session.createQuery(ALL_EMP_QUERY).list();

			session.getTransaction().commit();

			Map<Integer, String> managersMap = new HashMap<>();
			employees.forEach(emp -> managersMap.put(emp.getEmployeeId(), getName(emp)));

			logger.info("Found {} managers", managersMap.size());
			List<EmployeeDetails> result = employees.stream().map(emp -> new EmployeeDetails(emp))
					.collect(Collectors.toList());

			logger.info("Retreived total {} employees", result.size());
			return result.stream().map(emp -> {
				emp.setManager(managersMap.get(emp.getReportingTo()));
				unescapeHtml(emp);
				return emp;
			}).collect(Collectors.toList());
		}
	}

	public static List<EmployeeDetails> getAllReportingTo(int managerId, int currentEmployeeId) {
		logger.info("Getting all employees reporting to {}", managerId);

		try (Session session = beginTransaction()) {

			// Check authorization
			Employee currentEmployee = getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			if (!isAdmin(currentEmployee) && !isManager(currentEmployee)) {
				logger.error("Aborting request. Current employee id {} does not have permissions.", currentEmployeeId);
				abortUnauthorizedRequest("Current employee does not have permissions");
			}
			System.out.println("Authorized");

			Employee manager = getEmployee(managerId, session);
			if (manager == null) {
				logger.error("Manager {} not found", managerId);
				currentEmployeeNotFound(managerId);
			}
			String managerName = getName(manager);

			Query<Employee> query = session.createQuery(ALL_EMP_REPORTING_TO_QUERY);
			query.setParameter("reportingTo", managerId);
			List<Employee> employees = query.list();

			session.getTransaction().commit();

			logger.info("Retreived {} employees reporting to {}", employees.size(), managerId);
			return employees.stream().map(emp -> new EmployeeDetails(emp, managerName)).map(emp -> unescapeHtml(emp))
					.collect(Collectors.toList());
		}
	}

	public static List<Employee> getAllManagers() {
		logger.info("Getting all managers");

		try (Session session = beginTransaction()) {

			Query<Employee> query = session.createQuery(ALL_MANAGERS_QUERY);
			List<Employee> employees = query.list();

			session.getTransaction().commit();

			logger.info("Retreived {} managers", employees.size());
			return employees.stream().map(emp -> {
				Employee e = new Employee();
				e.setEmployeeId(emp.getEmployeeId());
				e.setFirstName(getName(emp));
				return e;
			}).map(emp -> unescapeHtml(emp)).collect(Collectors.toList());
		}
	}

	public static EmployeeDetails update(Employee employee, int currentEmployeeId) {
		logger.info("Update employee {}", employee.getEmployeeId());

		try (Session session = beginTransaction()) {

			// Check authorization
			Employee currentEmployee = getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			int employeeId = employee.getEmployeeId();
			if (currentEmployeeId != employeeId) { // Not accessing own records
				if (!isAdmin(currentEmployee) && !isManager(employee, currentEmployee)) {
					logger.error("Aborting request. Current employee id {} does not have permissions.",
							currentEmployeeId);
					abortUnauthorizedRequest("Current employee does not have permissions");
				}
			}

			// Check username availability
			Query<Employee> usernameQuery = session.createQuery(USERNAME_QUERY);
			usernameQuery.setParameter("username", employee.getUsername());
			List<Employee> employees = usernameQuery.list();
			if (!employees.isEmpty() && employees.get(0).getEmployeeId() != employee.getEmployeeId()) {
				logger.error("Aborting request. Username is not avaialble.");
				AbortRequestUtil.abortBadRequest("Username not available");
			}

			Query<Employee> query = session.createQuery(EMP_QUERY);
			query.setParameter("employeeId", employeeId);
			employee.setPassword(query.list().get(0).getPassword());
			employee.setValid(true);

			sanitizeAndValidate(employee);
			session.merge(employee);
			EmployeeDetails updatedEmployeeDetails = getEmployeeDetails(employeeId, session);
			session.getTransaction().commit();

			employee.setPassword("");
			logger.info("Updated employee with id {}", employeeId);
//		return sanitizeAndEncode(updatedEmployeeDetails);
			return updatedEmployeeDetails;
		}
	}

	public static void delete(int employeeId, int currentEmployeeId) {
		logger.info("Delete employee {}", employeeId);

		try (Session session = beginTransaction()) {

			// Check authorization
			Employee currentEmployee = getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			Employee employee = getEmployee(employeeId, session);
			if (!isAdmin(currentEmployee) && !isManager(employee, currentEmployee)) {
				logger.error("Aborting request. Current employee id {} does not have permissions.", currentEmployeeId);
				abortUnauthorizedRequest("Current employee does not have permissions");
			}

			employee.setValid(false);
			session.merge(employee);
			session.getTransaction().commit();
		}
		logger.info("Deleted employee with id {}", employeeId);
	}

	public static boolean isUsernameAvailable(String username) {
		logger.info("Check availability for username {}", username);

		try (Session session = beginTransaction()) {
			Query<Employee> query = session.createQuery(USERNAME_QUERY);
			query.setParameter("username", username);
			List<Employee> employees = query.list();
			session.getTransaction().commit();

			logger.info("{} username availability: {}", username, employees.isEmpty());
			return employees.isEmpty();
		}
	}

	@Nullable
	public static EmployeeDetails getEmployeeDetails(int employeeId, Session session) {
		Employee employee = getEmployee(employeeId, session);
		if (employee == null) {
			return null;
		}

		Employee manager = getEmployee(employee.getReportingTo(), session);
		return unescapeHtml(new EmployeeDetails(employee, manager == null ? "" : getName(manager)));
	}

	@Nullable
	public static Employee getEmployee(int employeeId, Session session) {
		Query<Employee> query = session.createQuery(EMP_QUERY);
		query.setParameter("employeeId", employeeId);
		Employee employee = query.list().isEmpty() ? null : query.list().get(0);

		return unescapeHtml(employee);
	}

	public static String getName(Employee e) {
		return String.format("%s %s", e.getFirstName(), e.getLastName());
	}

	public static void resetPassword(int employeeId, String currentPassword, String newPassword,
			int currentEmployeeId) {
		logger.info("Reset password for employee {}", employeeId);

		try (Session session = beginTransaction()) {
			// Check authorization
			Employee currentEmployee = getEmployee(currentEmployeeId, session);
			if (currentEmployee == null) {
				logger.error("Current employee id {} not found", currentEmployeeId);
				currentEmployeeNotFound(currentEmployeeId);
			}
			if (currentEmployeeId != employeeId) {
				logger.error("Aborting request. Not authorized to reset password for other employee",
						currentEmployeeId);
				abortUnauthorizedRequest("Not authorized to reset password for other employee");
			}

			if (PasswordUtility.validate(currentPassword, currentEmployee.getPassword())) {
				currentEmployee.setPassword(PasswordUtility.generate(newPassword));
				session.merge(currentEmployee);
				session.getTransaction().commit();
			} else {
				logger.error("Aborting request. Current password invalid", currentEmployeeId);
				AbortRequestUtil.abortBadRequest("Current password is invalid.");
			}

			logger.info("Updated password for employee {}", employeeId);
		}
	}

	private static void sanitizeAndValidate(Employee employee) {
		employee.setFirstName(POLICY.sanitize(employee.getFirstName()));
		if (employee.getMiddleName() != null) {
			employee.setMiddleName(POLICY.sanitize(employee.getMiddleName()));
		}
		employee.setLastName(POLICY.sanitize(employee.getLastName()));
		employee.setUsername(POLICY.sanitize(employee.getUsername()));
		employee.setDesignation(POLICY.sanitize(employee.getDesignation()));
		employee.setProject(POLICY.sanitize(employee.getProject()));
		employee.setAddress(POLICY.sanitize(employee.getAddress()));

		List<String> invalidFields = new ArrayList<>();
		if (isNullOrEmpty(employee.getFirstName())) {
			invalidFields.add("First Name");
		}
		if (isNullOrEmpty(employee.getLastName())) {
			invalidFields.add("Last Name");
		}
		if (isNullOrEmpty(employee.getUsername())) {
			invalidFields.add("Username");
		}
		if (isNullOrEmpty(employee.getDesignation())) {
			invalidFields.add("Designation");
		}
		if (isNullOrEmpty(employee.getProject())) {
			invalidFields.add("Project");
		}
		if (isNullOrEmpty(employee.getEmail()) || !EMAIL_VALIDATOR.isValid(employee.getEmail())) {
			invalidFields.add("Email");
		}
		if (isNullOrEmpty(employee.getAddress())) {
			invalidFields.add("Address");
		}
		if (!employee.getPhone().matches(PHONE_VALIDATOR_PATTERN)) {
			invalidFields.add("Phone");
		}

		HtmlSanitizationUtils.abortRequestForInvalidFields(invalidFields);
	}

//	public static Employee sanitizeAndEncode(Employee employee) {
//		employee.setFirstName(Encode.forHtmlContent(employee.getFirstName()));
//		if (employee.getMiddleName() != null) {
//			employee.setMiddleName(Encode.forHtmlContent(employee.getMiddleName()));
//		}
//		employee.setLastName(Encode.forHtmlContent(employee.getLastName()));
//		employee.setUsername(Encode.forHtmlContent(employee.getUsername()));
//		employee.setDesignation(Encode.forHtmlContent(employee.getDesignation()));
//		employee.setProject(Encode.forHtmlContent(employee.getProject()));
//		employee.setEmail(Encode.forHtmlContent(employee.getEmail()));
//		employee.setAddress(Encode.forHtmlContent(employee.getAddress()));
//
//		return employee;
//	}

//	private static EmployeeDetails sanitizeAndEncode(EmployeeDetails employee) {
//		employee.setFirstName(Encode.forHtmlContent(employee.getFirstName()));
//		if (employee.getMiddleName() != null) {
//			employee.setMiddleName(Encode.forHtmlContent(employee.getMiddleName()));
//		}
//		employee.setLastName(Encode.forHtmlContent(employee.getLastName()));
//		employee.setUsername(Encode.forHtmlContent(employee.getUsername()));
//		employee.setDesignation(Encode.forHtmlContent(employee.getDesignation()));
//		employee.setProject(Encode.forHtmlContent(employee.getProject()));
//		employee.setEmail(Encode.forHtmlContent(employee.getEmail()));
//		employee.setAddress(Encode.forHtmlContent(employee.getAddress()));
//		employee.setManager(Encode.forHtmlContent(employee.getManager()));
//
//		return employee;
//	}

	private static boolean isNullOrEmpty(String str) {
		return str == null || str.isEmpty();
	}

	private static Employee unescapeHtml(Employee employee) {
		employee.setFirstName(unescapeHtml4(employee.getFirstName()));
		if (employee.getMiddleName() != null) {
			employee.setMiddleName(unescapeHtml4(employee.getMiddleName()));
		}
		employee.setLastName(unescapeHtml4(employee.getLastName()));
		employee.setUsername(unescapeHtml4(employee.getUsername()));
		employee.setDesignation(unescapeHtml4(employee.getDesignation()));
		employee.setProject(unescapeHtml4(employee.getProject()));
		employee.setAddress(unescapeHtml4(employee.getAddress()));

		return employee;
	}

	private static EmployeeDetails unescapeHtml(EmployeeDetails employee) {
		employee.setFirstName(unescapeHtml4(employee.getFirstName()));
		if (employee.getMiddleName() != null) {
			employee.setMiddleName(unescapeHtml4(employee.getMiddleName()));
		}
		employee.setLastName(unescapeHtml4(employee.getLastName()));
		employee.setUsername(unescapeHtml4(employee.getUsername()));
		employee.setDesignation(unescapeHtml4(employee.getDesignation()));
		employee.setProject(unescapeHtml4(employee.getProject()));
		employee.setAddress(unescapeHtml4(employee.getAddress()));
		if (employee.getManager() != null) {
			employee.setManager(unescapeHtml4(employee.getManager()));
		}

		return employee;
	}
//
//	private static String firstNonNull(Object obj1, Object obj2) {
//		return (obj1 == null ? obj2 : obj1).toString();
//	}
//
//	private static OffsetDateTime parseToOffsetDateTime(Object o) {
//		if (o == null)
//			return null;
//
//		String s = o.toString();
//		if (s.isEmpty())
//			return null;
//
//		return OffsetDateTime.parse(s, DateTimeFormatter.ofPattern("YYYY-MM-DD hh:mm:ss.s"));
//	}
}
