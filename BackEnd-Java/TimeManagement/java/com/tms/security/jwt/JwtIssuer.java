package com.tms.security.jwt;

import java.security.NoSuchAlgorithmException;
import java.util.Date;

import io.jsonwebtoken.Jwts;

/**
 * Final class to issue JWTs while logging into the system.
 * 
 */
public final class JwtIssuer {
	public static String issueToken(int employeeId) throws NoSuchAlgorithmException {
		return Jwts.builder().setSubject(Integer.toString(employeeId)).setAudience("TMS-Angular").setIssuer("TMS")
				.setIssuedAt(new Date()).signWith(JwtConfig.SIGNATURE_ALGORITHM, JwtConfig.getInstance().getKey())
				.compact();
	}
}
