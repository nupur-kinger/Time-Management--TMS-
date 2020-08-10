package com.tms.security.jwt;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.net.URI;
import java.security.NoSuchAlgorithmException;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

import org.junit.Rule;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;

import com.sun.jersey.spi.container.ContainerRequest;

public class JwtTokenTest {
	@Rule
    public MockitoRule mockitoRule = MockitoJUnit.rule();
	
	@Mock
	ContainerRequest containerRequest;
	
	private static final URI REQUEST_URI = URI.create("/javase");
	private JwtParseFilter uut = new JwtParseFilter();
	
	@Test
	public void shouldGenerateJwtToken() throws NoSuchAlgorithmException {
		assertNotNull(JwtIssuer.issueToken(1003));
	}

	@Test
	public void shouldThrowExceptionWhenAuthHeaderIsMissing() throws NoSuchAlgorithmException {
		when(containerRequest.getHeaderValue(HttpHeaders.AUTHORIZATION)).thenReturn(null);
		when(containerRequest.getRequestUri()).thenReturn(REQUEST_URI);
		
		WebApplicationException exception = assertThrows(WebApplicationException.class,
				() -> uut.filter(containerRequest));
		
		assertEquals(exception.getResponse().getStatus(), Response.Status.UNAUTHORIZED.getStatusCode());
	}
	
	@Test
	public void shouldSkipFilteringForSpecificPaths() {
		when(containerRequest.getRequestUri()).thenReturn(URI.create("/javase/login"));
		uut.filter(containerRequest);
		
		verify(containerRequest, never()).getHeaderValue(HttpHeaders.AUTHORIZATION);
	}
	
	@Test
	public void shouldValidateTheToken() throws NoSuchAlgorithmException {
		String token = JwtIssuer.issueToken(1003);
		
		when(containerRequest.getRequestUri()).thenReturn(REQUEST_URI);
		when(containerRequest.getHeaderValue(HttpHeaders.AUTHORIZATION)).thenReturn(JwtConfig.AUTHENTICATION_SCHEME + token);
		
		uut.filter(containerRequest);
	}
}
