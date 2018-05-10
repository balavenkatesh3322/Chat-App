package com.spritle.chatapp.dao;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.spritle.chatapp.domain.entities.UserDetail;
import com.spritle.chatapp.domain.entities.Usercomments;
import com.spritle.chatapp.domain.entities.Userlikes;
import com.spritle.chatapp.domain.entities.Usertodayinteresting;

@Repository
public class UsertodayinterestingRepository {

	@Autowired
	private SessionFactory _sessionFactory;


	private Session getSession() {
		return _sessionFactory.getCurrentSession();
	}
	
	
	
	public void savetodayinteresting(Usertodayinteresting usertodayinteresting) {
		 getSession().save(usertodayinteresting);
	}
	
	@SuppressWarnings("unchecked")
	public List<Usertodayinteresting> findByAlltodayinteresting(String activestatus,String username) {
		
		//List<Usertodayinteresting>  Usertodayinteresting=new ArrayList<Usertodayinteresting>();
		 List<Usertodayinteresting>  listUsertodayinteresting =getSession().createQuery("from Usertodayinteresting where activestatus=:activestatus").setParameter("activestatus", activestatus).list();
		 
		 for(Usertodayinteresting usertodayinteresting:listUsertodayinteresting) {
			 List<Userlikes>  userlikes= getSession().createQuery(" from Userlikes where interestingid = :id").setParameter("id", usertodayinteresting.getInterestingid()).list();
			 if(userlikes!=null) {
				 usertodayinteresting.setLikescount(userlikes.size()); 
			 }
			 List<Usercomments>  usercomments= getSession().createQuery(" from Usercomments where interestingid = :id")
				.setParameter("id", usertodayinteresting.getInterestingid()).list();
			 if(usercomments!=null) {
				 usertodayinteresting.setCommentscount(usercomments.size()); 
			 }	
			 List<Userlikes>  isuserlikes= getSession().createQuery(" from Userlikes where interestingid = :id and crusername=:username").setParameter("id", usertodayinteresting.getInterestingid())
					 .setParameter("username", username).list();
			 if(isuserlikes!=null && isuserlikes.size()>0) {
				 usertodayinteresting.setUserhaslike(true); 
			 }else {
				 usertodayinteresting.setUserhaslike(false);
			 }
			// Usertodayinteresting.add(usertodayinteresting);
		 }
		 
		 return listUsertodayinteresting;
	}
	
	
	

	@SuppressWarnings("unchecked")
	public List<Usertodayinteresting> findByinterestingid(int id) {
		return getSession().createQuery(" from Usertodayinteresting where interestingid = :id")
				.setParameter("id", id).list();
	}

	@SuppressWarnings("unchecked")
	public List<Usertodayinteresting> findByUsernamebyactivestatus(String id,String activestatus) {
		return getSession().createQuery(" from Usertodayinteresting where interestingid = :id and activeStatus=:activeStatus")
				.setParameter("id", id).setParameter("activeStatus", activestatus).list();
	}
	
	
	
	
}
