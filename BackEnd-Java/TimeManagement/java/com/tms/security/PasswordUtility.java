package com.tms.security;

import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.tms.exceptions.AbortRequestUtil;

/**
 * Hashes the user-given password using PBKDF2.
 */
public final class PasswordUtility {
	private static final Logger logger = LogManager.getLogger(PasswordUtility.class);
	private static final int ITERATIONS = 1000;
	private static final int KEY_LENGTH = 64 * 8;
	private static final String KEY_ALGORITHM = "PBKDF2WithHmacSHA1";
	private static final String SALT_ALGORITHM = "SHA1PRNG";
	private static final String PASSWORD_REGEX = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}";

	public static String generate(String password) {
		if (!hasValidPassword(password)) {
			// Abort request
			logger.error("Received invalid password");
			AbortRequestUtil.abortBadRequest("Received invalid password");
		}

		try {
			byte[] salt = getSalt();

			PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
			SecretKeyFactory skf = SecretKeyFactory.getInstance(KEY_ALGORITHM);
			byte[] hash = skf.generateSecret(spec).getEncoded();
			return toHex(salt) + ":" + toHex(hash);
		} catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
			logger.error("Exception in password generation", e);
			AbortRequestUtil.abortRequest();
		}
		
		return null;
	}

	public static boolean validate(String loginPassword, String storedPassword) {
		if (loginPassword == null || loginPassword.isEmpty()) {
			// Abort request
			logger.error("Received blank password");
			AbortRequestUtil.abortBadRequest("Received blank password");
		}

		try {
			String[] parts = storedPassword.split(":");
			byte[] salt = fromHex(parts[0]);
			byte[] hash = fromHex(parts[1]);

			PBEKeySpec spec = new PBEKeySpec(loginPassword.toCharArray(), salt, ITERATIONS, hash.length * 8);
			SecretKeyFactory skf = SecretKeyFactory.getInstance(KEY_ALGORITHM);
			byte[] testHash = skf.generateSecret(spec).getEncoded();

			int diff = hash.length ^ testHash.length;
			for (int i = 0; i < hash.length && i < testHash.length; i++) {
				diff |= hash[i] ^ testHash[i];
			}
			return diff == 0;
		} catch (InvalidKeySpecException | NoSuchAlgorithmException e) {
			logger.error("Exception in password validation", e);
			AbortRequestUtil.abortRequest();
		}
		return false;
	}

	private static byte[] getSalt() throws NoSuchAlgorithmException {
		SecureRandom sr = SecureRandom.getInstance(SALT_ALGORITHM);
		byte[] salt = new byte[16];
		sr.nextBytes(salt);
		return salt;
	}

	private static String toHex(byte[] array) throws NoSuchAlgorithmException {
		BigInteger bi = new BigInteger(1, array);
		String hex = bi.toString(16);
		int paddingLength = (array.length * 2) - hex.length();
		if (paddingLength > 0) {
			return String.format("%0" + paddingLength + "d", 0) + hex;
		} else {
			return hex;
		}
	}

	private static byte[] fromHex(String hex) throws NoSuchAlgorithmException {
		byte[] bytes = new byte[hex.length() / 2];
		for (int i = 0; i < bytes.length; i++) {
			bytes[i] = (byte) Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
		}
		return bytes;
	}

	private static boolean hasValidPassword(String password) {
		if (password == null || password.isEmpty()) {
			return false;
		}
		if (!password.matches(PASSWORD_REGEX)) {
			return false;
		}

		return true;
	}
}
