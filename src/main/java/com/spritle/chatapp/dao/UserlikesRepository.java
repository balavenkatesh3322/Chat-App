package com.spritle.chatapp.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.spritle.chatapp.domain.entities.UserDetail;
import com.spritle.chatapp.domain.entities.Userlikes;
import com.spritle.chatapp.domain.entities.Usertodayinteresting;

@Repository
public class UserlikesRepository {

	@Autowired
	private SessionFactory _sessionFactory;


	private Session getSession() {
		return _sessionFactory.getCurrentSession();
	}
	
	
	public void savelikes(Userlikes userlikes) {
		 getSession().save(userlikes);
	}


	@SuppressWarnings("unchecked")
	public List<Userlikes> findByinterestingid(int id) {
		return getSession().createQuery(" from Userlikes where interestingid = :id")
				.setParameter("id", id).list();
	}
	
}
