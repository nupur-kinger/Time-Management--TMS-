package com.tms.security.jwt;

import java.security.Key;
import java.security.NoSuchAlgorithmException;

import javax.crypto.KeyGenerator;

import io.jsonwebtoken.SignatureAlgorithm;

/**
 * Static values for JWT issue and parsing.
 */
public final class JwtConfig {
	private static Key KEY;
	public static final String KEY_ALGORITHM = "HmacSHA256";
	public static final SignatureAlgorithm SIGNATURE_ALGORITHM = SignatureAlgorithm.HS256;
	public static final String AUTHENTICATION_SCHEME = "Bearer";
	
	private static final JwtConfig INSTANCE = new JwtConfig();
	
	private JwtConfig() {
		try {
			KEY = KeyGenerator.getInstance(KEY_ALGORITHM).generateKey();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}
	
	public static JwtConfig getInstance() {
		return INSTANCE;
	}
	
	public Key getKey() {
		return KEY;
	}
}
