package com.tms.hibernate;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import org.hibernate.cfg.Configuration;

/**
 * Class for instantiating and shutting down hibernate sessions.
 */
public class HibernateUtil {
	private static final Logger logger = LogManager.getLogger(HibernateUtil.class);

	private static final SessionFactory sessionFactory;

	static {
		try {
			sessionFactory = new Configuration().configure().buildSessionFactory();
			logger.info("Built session factory");
		} catch (Throwable ex) {
			logger.info("Error in creating session factory: %s", ex.getMessage());
			System.err.println("Session Factory could not be created." + ex);
			throw new ExceptionInInitializerError(ex);
		}
	}

	private static SessionFactory getSessionFactory() {
		return sessionFactory;
	}

	public static void shutdown() {
		getSessionFactory().close();
	}

	public static Session beginTransaction() {
		Session session = getSessionFactory().openSession();
		session.beginTransaction();
		return session;
	}
}