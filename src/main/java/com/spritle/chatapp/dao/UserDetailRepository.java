package com.spritle.chatapp.dao;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.spritle.chatapp.domain.entities.UserDetail;

@Repository
public class UserDetailRepository {
	@Autowired
	private SessionFactory _sessionFactory;

	

	private Session getSession() {
		return _sessionFactory.getCurrentSession();
	}

	public void saveuserdetail(UserDetail userDetail) {
		 getSession().save(userDetail);
	}
	
	@SuppressWarnings("unchecked")
	public List<UserDetail> findByAll() {
		return getSession().createQuery("from UserDetail").list();
	}
	
	
	

	@SuppressWarnings("unchecked")
	public List<UserDetail> findByUsername(String username) {
		return getSession().createQuery(" from UserDetail where username = :username")
				.setParameter("username", username).list();
	}

	@SuppressWarnings("unchecked")
	public UserDetail findByUsernamebyactivestatus(String username,String activestatus) {
		return (UserDetail) getSession().createQuery(" from UserDetail where username = :username and activestatus=:activeStatus")
				.setParameter("username", username).setParameter("activeStatus", activestatus).list().get(0);
	}

}