package com.tms.service.helper;

import static com.tms.hibernate.HibernateUtil.beginTransaction;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.query.Query;

import com.tms.hibernate.model.Employee;
import com.tms.security.PasswordUtility;
import com.tms.vo.EmployeeDetails;

@SuppressWarnings("unchecked")
public final class AuthenticationServiceHelper {
	private static final Logger logger = LogManager.getLogger(AuthenticationServiceHelper.class);

	private static final String AUTH_QUERY = "FROM Employee t WHERE t.username = :username AND t.isValid = 1";

	public static EmployeeDetails login(String username, String password)
			throws NoSuchAlgorithmException, InvalidKeySpecException {
		logger.info(String.format("Log in for username '%s'", username));
		try (Session session = beginTransaction()) {

			Query<Employee> query = session.createQuery(AUTH_QUERY);
			query.setParameter("username", username);

			List<Employee> employeeList = query.list();

			if (employeeList.isEmpty()) {
				logger.warn("Employee not found. Returning null");
				return null;
			}

			Employee employee = employeeList.get(0);
			Employee manager = EmployeeServiceHelper.getEmployee(employee.getReportingTo(), session);

			EmployeeDetails employeeDetails = new EmployeeDetails(employee,
					manager == null ? "" : EmployeeServiceHelper.getName(manager));

			session.getTransaction().commit();

			if (PasswordUtility.validate(password, employee.getPassword())) {
				logger.info("Password validated. Login successful for employee " + username);
				return employeeDetails;
			}

			logger.warn("Password validation failed for employee " + username);
			return null;
		}
	}
}
