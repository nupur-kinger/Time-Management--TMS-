package com.tms.service.helper;

import static java.time.format.DateTimeFormatter.ISO_OFFSET_DATE_TIME;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.DeserializationContext;
import org.codehaus.jackson.map.JsonDeserializer;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;

/**
 * A collection of implementations of serializers and deserializers.
 */
public class JacksonSerializerDeserializer {
	public static class OffsetDateDeserializer extends JsonDeserializer<OffsetDateTime> {
		@Override
		public OffsetDateTime deserialize(JsonParser date, DeserializationContext deserializationContext)
				throws IOException {
			return OffsetDateTime.parse(date.getText(), ISO_OFFSET_DATE_TIME);
		}
	}
	
	public static class OffsetDateSerializer extends JsonSerializer<OffsetDateTime> {
		@Override
		public void serialize(OffsetDateTime date, JsonGenerator jsonGenerator, SerializerProvider serializerProvider)
				throws IOException {
			jsonGenerator.writeString(date.toString());
		}
	}
	
	public static class LocalDateDeserializer extends JsonDeserializer<LocalDate> {
		@Override
		public LocalDate deserialize(JsonParser date, DeserializationContext deserializationContext)
				throws IOException {
			return LocalDate.parse(date.getText(), ISO_OFFSET_DATE_TIME);
		}
	}

	public static class LocalDateSerializer extends JsonSerializer<LocalDate> {
		@Override
		public void serialize(LocalDate date, JsonGenerator jsonGenerator, SerializerProvider serializerProvider)
				throws IOException {
			jsonGenerator.writeString(date.toString());
		}
	}

	public static class InstantSerializer extends JsonSerializer<Instant> {
		@Override
		public void serialize(Instant value, JsonGenerator jsonGenerator, SerializerProvider serializers)
				throws IOException, JsonProcessingException {
			jsonGenerator.writeString(Long.toString(value.getEpochSecond()));
		}
	}

	public static class InstantDeserializer extends JsonDeserializer<Instant> {
		@Override
		public Instant deserialize(JsonParser p, DeserializationContext ctxt)
				throws IOException, JsonProcessingException {
			return Instant.ofEpochMilli(new Long(p.getText()));
		}
	}
}
