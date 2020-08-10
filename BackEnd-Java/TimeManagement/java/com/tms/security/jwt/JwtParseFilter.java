package com.tms.security.jwt;

import java.util.Arrays;
import java.util.Optional;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.sun.jersey.spi.container.ContainerRequest;
import com.sun.jersey.spi.container.ContainerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;

/**
 * Request interceptor for implementing authorization by filtering requests
 * without a valid token.
 */
public class JwtParseFilter implements ContainerRequestFilter {
	private static final Logger logger = LogManager.getLogger(JwtParseFilter.class);

	private static final String[] SKIP_VALIDATION_PATHS = new String[] { "/login", "/getAllManagers",
			"/employee/register", "/isUsernameAvailable" };
	private static final String REALM = "Token";

	@Override
	public ContainerRequest filter(ContainerRequest request) {
		logger.info("Filtering request {}", request.toString());
		if (!isTokenNeeded(request)) {
			logger.info("Token not needed for {}", request.getRequestUri().getPath());
			return request;
		}

		String header = request.getHeaderValue(HttpHeaders.AUTHORIZATION);
		if (header == null) {
			logger.error("Authorization header missing. Aborting request");
			abortRequest();
		}

		String token = header.substring(JwtConfig.AUTHENTICATION_SCHEME.length()).trim();

		try {
			Jwts.parser().setSigningKey(JwtConfig.getInstance().getKey()).parseClaimsJws(token);
			logger.info("Token parsed successfully");
		} catch (Exception e) {
			logger.error("Token parsing failed. Aborting request");
			abortRequest();
		}

		return request;
	}

	public static int getEmployeeId(HttpHeaders httpHeaders) {
		String header = httpHeaders.getRequestHeader(HttpHeaders.AUTHORIZATION).get(0);

		if (header == null) {
			logger.error("Authorization header missing. Aborting request");
			abortRequest();
		}

		String token = header.substring(JwtConfig.AUTHENTICATION_SCHEME.length()).trim();

		try {
			Jws<Claims> claims = Jwts.parser().setSigningKey(JwtConfig.getInstance().getKey()).parseClaimsJws(token);
			return new Integer(claims.getBody().get("sub").toString());
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Token parsing failed. Aborting request");
			abortRequest();
		}

		logger.error("Token parsing did not fail but returning 0 employee id. This should never happen");
		// This should never be reached
		return 0;
	}

	private static void abortRequest() {
		throw new WebApplicationException(Response.status(Response.Status.UNAUTHORIZED)
				.header(HttpHeaders.WWW_AUTHENTICATE, JwtConfig.AUTHENTICATION_SCHEME + " realm=\"" + REALM + "\"")
				.build());
	}

	private static boolean isTokenNeeded(ContainerRequest request) {
		String path = request.getRequestUri().getPath();
		Optional<String> pathOptional = Arrays.stream(SKIP_VALIDATION_PATHS).filter(p -> path.endsWith(p)).findFirst();
		return !pathOptional.isPresent();
	}
}
