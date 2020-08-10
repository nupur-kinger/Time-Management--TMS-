package com.tms.exceptions;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

public final class AbortRequestUtil {
	public static void abortBadRequest(String errorMessage) {
		abortRequest(errorMessage, Status.BAD_REQUEST);
	}

	public static void abortUnauthorizedRequest(String errorMessage) {
		abortRequest(errorMessage, Status.UNAUTHORIZED);
	}

	public static void abortRequest(String errorMessage, Status responseStatus) {
		throw new WebApplicationException(
				Response.status(responseStatus).entity(errorMessage).type(MediaType.TEXT_HTML).build());
	}

	public static void abortRequest(Status responseStatus) {
		throw new WebApplicationException(Response.status(responseStatus).build());
	}
	
	public static void abortRequest() {
		throw new WebApplicationException();
	}
}
