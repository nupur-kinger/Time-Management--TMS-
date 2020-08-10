package com.tms.hibernate.model;

import static com.tms.service.helper.JacksonSerializerDeserializer.LocalDateDeserializer;
import static com.tms.service.helper.JacksonSerializerDeserializer.LocalDateSerializer;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.tms.service.helper.JacksonSerializerDeserializer.OffsetDateDeserializer;
import com.tms.service.helper.JacksonSerializerDeserializer.OffsetDateSerializer;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "EMPLOYEE")
public class Employee implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "employee_id", nullable = false)
	private int employeeId;

	@Column(name = "f_name" , nullable = false)
	private String firstName;
	
	@Column(name = "m_name")
	private String middleName;
	
	@Column(name = "l_name" , nullable = false)
	private String lastName;
	
	@Column(name = "username" , nullable = false)
	private String username;
	
	@Column(name = "password" , nullable = false)
	private String password;
	
	@Column(name = "gender" , nullable = false)
	private String gender;
	
	@Column(name = "is_valid" , nullable = false)
	private boolean isValid;
	
	@Column(name = "date_of_birth" , nullable = false)
	private LocalDate dateOfBirth;
	
	@Column(name = "role" , nullable = false)
	private int role;
	
	@Column(name = "designation" , nullable = false)
	private String designation;
	
	@Column(name = "project" , nullable = false)
	private String project;
	
	@Column(name = "reporting_to")
	private int reportingTo;
	
	@Column(name = "start_time" , nullable = false)
	private OffsetDateTime startTime;

	@Column(name = "end_time" , nullable = false)
	private OffsetDateTime endTime;

	@Column(name = "email" , nullable = false)
	private String email;

	@Column(name = "phone" , nullable = false)
	private String phone;

	@Column(name = "address" , nullable = false)
	private String address;

	public int getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(int employeeId) {
		this.employeeId = employeeId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public boolean isValid() {
		return isValid;
	}

	public void setValid(boolean isValid) {
		this.isValid = isValid;
	}

	@JsonSerialize(using = LocalDateSerializer.class)
	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	@JsonDeserialize(using = LocalDateDeserializer.class)
	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public int getRole() {
		return role;
	}

	public void setRole(int role) {
		this.role = role;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public String getProject() {
		return project;
	}

	public void setProject(String project) {
		this.project = project;
	}

	public int getReportingTo() {
		return reportingTo;
	}

	public void setReportingTo(int reportingTo) {
		this.reportingTo = reportingTo;
	}

	@JsonSerialize(using = OffsetDateSerializer.class)
	public OffsetDateTime getStartTime() {
		return startTime;
	}


	@JsonDeserialize(using = OffsetDateDeserializer.class)
	public void setStartTime(OffsetDateTime startTime) {
		this.startTime = startTime;
	}

	@JsonSerialize(using = OffsetDateSerializer.class)
	public OffsetDateTime getEndTime() {
		return endTime;
	}

	@JsonDeserialize(using = OffsetDateDeserializer.class)
	public void setEndTime(OffsetDateTime endTime) {
		this.endTime = endTime;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
}
