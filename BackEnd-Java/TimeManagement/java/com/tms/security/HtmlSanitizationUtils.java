package com.tms.security;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;

import com.tms.exceptions.AbortRequestUtil;

public final class HtmlSanitizationUtils {
	private static final Logger logger = LogManager.getLogger(HtmlSanitizationUtils.class);

	/**
	 * Default policy to strip off all HTML tags
	 */
	public static final PolicyFactory POLICY = new HtmlPolicyBuilder().toFactory();
	
	/**
	 * Aborts current request if one or more fields are invalid.
	 */
	public static void abortRequestForInvalidFields(List<String> invalidFields) {
		if (!invalidFields.isEmpty()) {
			String fields = invalidFields.stream().collect(Collectors.joining(", "));
			logger.error("Null/empty/invalid data post-sanitization for following fields: {}", fields);
			AbortRequestUtil.abortBadRequest("Invalid data in following field(s): " + fields);
		}
	}
}
