package com.spritle.chatapp.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.spritle.chatapp.domain.entities.UserDetail;
import com.spritle.chatapp.domain.entities.Usercomments;
import com.spritle.chatapp.domain.entities.Userlikes;


@Repository
public class UsercommentsRepository {

	@Autowired
	private SessionFactory _sessionFactory;


	private Session getSession() {
		return _sessionFactory.getCurrentSession();
	}
	
	

	public void savecomments(Usercomments usercomments) {
		 getSession().save(usercomments);
	}
	
	@SuppressWarnings("unchecked")
	public List<Usercomments> findByinterestingid(int id,String activestatus) {
		return getSession().createQuery(" from Usercomments where interestingid = :id and activestatus=:activestatus")
				.setParameter("id", id).setParameter("activestatus", activestatus).list();
	}
	
	
}
