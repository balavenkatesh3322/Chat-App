package com.spritle.chatapp.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import com.spritle.chatapp.controller.WebController;
import com.spritle.chatapp.dao.UsertodayinterestingRepository;
import com.spritle.chatapp.domain.entities.Usertodayinteresting;
import com.spritle.chatapp.domain.pojos.SessionData;

@Service
public class UserTodayIntrestingService {


	@Autowired
	private UsertodayinterestingRepository usertodayinterestingRepository;
	
	@Autowired
	private WebController webController;
	
	
	@Value("${ACTIVE_STATUS}")
	private String ACTIVE_STATUS;
	
	public void savetodayintersting( String intrestingdata) {
		SessionData session=webController.getSessionData();
		Usertodayinteresting usertodayinteresting=new Usertodayinteresting();
		usertodayinteresting.setIntrestingdata(intrestingdata);
		usertodayinteresting.setActivestatus(ACTIVE_STATUS);
		usertodayinteresting.setCrdate(new Date());
		usertodayinteresting.setCrusername(session.getUsername());
		
		usertodayinterestingRepository.savetodayinteresting(usertodayinteresting);
		
	}
	
}
