package com.tms.junit.suite;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

import com.tms.security.PasswordUtilityTest;
import com.tms.security.jwt.JwtConfigTest;
import com.tms.security.jwt.JwtTokenTest;
import com.tms.service.helper.AuthenticationServiceHelperTest;
import com.tms.service.helper.TaskServiceHelperTest;

@RunWith(Suite.class)
@Suite.SuiteClasses({ 
	PasswordUtilityTest.class,
	JwtConfigTest.class,
	JwtTokenTest.class,
	AuthenticationServiceHelperTest.class,
})
public class JUnitSuite {
	// Holder class for test classes
}