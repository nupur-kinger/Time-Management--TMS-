package com.tms.security.jwt;

import static org.junit.Assert.assertNotNull;

import org.junit.Test;

public class JwtConfigTest {

	@Test
	public void shouldReturnNonNullInstance() {
		assertNotNull(JwtConfig.getInstance());
	}
	
	@Test
	public void shouldReturnGeneratedKey() {
		assertNotNull(JwtConfig.getInstance().getKey());
	}
}
