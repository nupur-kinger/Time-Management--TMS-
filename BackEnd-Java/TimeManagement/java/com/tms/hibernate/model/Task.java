package com.tms.hibernate.model;

import java.io.Serializable;
import java.time.OffsetDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.tms.service.helper.JacksonSerializerDeserializer.OffsetDateDeserializer;
import com.tms.service.helper.JacksonSerializerDeserializer.OffsetDateSerializer;

@Entity
@Table(name = "TASK")
public class Task implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "task_id", nullable = false)
	private int taskId;

	@Column(name = "DATE" , nullable = false )
	private OffsetDateTime date;

	@Column(name = "START_TIME" , nullable = false)
	private OffsetDateTime startTime;

	@Column(name = "END_TIME" , nullable = false)
	private OffsetDateTime endTime;

	@Column(name = "TASK", nullable = false)
	private String task;

	@Column(name = "NOTES")
	private String notes;

	@Column(name = "EMPLOYEE_ID", nullable = false)
	private int employeeId;

	public int getTaskId() {
		return taskId;
	}

	public void setTaskId(int taskId) {
		this.taskId = taskId;
	}

	@JsonSerialize(using = OffsetDateSerializer.class)
	public OffsetDateTime getDate() {
		return date;
	}


	@JsonDeserialize(using = OffsetDateDeserializer.class)
	public void setDate(OffsetDateTime date) {
		this.date = date;
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

	public String getTask() {
		return task;
	}

	public void setTask(String task) {
		this.task = task;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public int getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(int employeeId) {
		this.employeeId = employeeId;
	}

//	 private ObjectMapper om = new ObjectMapper();
}
