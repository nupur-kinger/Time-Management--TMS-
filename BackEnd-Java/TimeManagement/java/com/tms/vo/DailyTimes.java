package com.tms.vo;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.tms.service.helper.JacksonSerializerDeserializer.LocalDateSerializer;
import com.tms.service.helper.JacksonSerializerDeserializer.OffsetDateSerializer;

public class DailyTimes implements Serializable {

	private static final long serialVersionUID = 1L;
	
	private OffsetDateTime date;
	private OffsetDateTime from;
	private OffsetDateTime to;
	private boolean hasPreferredTimes;

	public boolean isHasPreferredTimes() {
		return hasPreferredTimes;
	}
	public void setHasPreferredTimes(boolean hasPreferredTimes) {
		this.hasPreferredTimes = hasPreferredTimes;
	}
	@JsonSerialize(using = OffsetDateSerializer.class)
	public OffsetDateTime getDate() {
		return date;
	}
	public void setDate(OffsetDateTime date) {
		this.date = date;
	}
	@JsonSerialize(using = OffsetDateSerializer.class)
	public OffsetDateTime getFrom() {
		return from;
	}
	public void setFrom(OffsetDateTime from) {
		this.from = from;
	}
	@JsonSerialize(using = OffsetDateSerializer.class)
	public OffsetDateTime getTo() {
		return to;
	}
	public void setTo(OffsetDateTime to) {
		this.to = to;
	}

}
