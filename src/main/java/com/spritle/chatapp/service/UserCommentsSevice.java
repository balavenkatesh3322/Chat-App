package com.spritle.chatapp.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.spritle.chatapp.controller.WebController;
import com.spritle.chatapp.dao.UserDetailRepository;
import com.spritle.chatapp.dao.UsercommentsRepository;
import com.spritle.chatapp.domain.entities.Usercomments;
import com.spritle.chatapp.domain.entities.Usertodayinteresting;
import com.spritle.chatapp.domain.pojos.SessionData;

@Service
public class UserCommentsSevice {

	@Value("${ACTIVE_STATUS}")
	private String ACTIVE_STATUS;
	
	@Autowired
	UsercommentsRepository usercommentsRepository;
	

	@Autowired
	private WebController webController;
	
	public void savecomments( String comments,int id) {
		SessionData session=webController.getSessionData();
		Usercomments usercomments=new Usercomments();
		usercomments.setUsercomments(comments);
		usercomments.setInterestingid(id);
		usercomments.setActivestatus(ACTIVE_STATUS);
		usercomments.setCrdate(new Date());
		usercomments.setCrusername(session.getUsername());		
		usercommentsRepository.savecomments(usercomments);
		
	}
	
}
