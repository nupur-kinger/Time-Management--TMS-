package com.tms.security;

import static com.tms.security.PasswordUtility.generate;
import static com.tms.security.PasswordUtility.validate;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

public class PasswordUtilityTest {
	@ParameterizedTest
	@ValueSource(strings = { "abc123", 
			"1234", 
			"password", 
			"random", 
			"password with spaces",
			"This is an unusually long password which is not realisitic, but just for testing sake." })
	public void shouldValidateTheGeneratedHash(String password)
			throws NoSuchAlgorithmException, InvalidKeySpecException {
		String hash = generate(password);
		assertTrue((validate(password, hash)));
		
		// Hash length should always be same
		assertEquals(hash.length(), 161);
	}
}
