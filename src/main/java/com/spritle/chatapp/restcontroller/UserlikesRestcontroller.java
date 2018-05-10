package com.spritle.chatapp.restcontroller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spritle.chatapp.controller.WebController;
import com.spritle.chatapp.dao.UserlikesRepository;
import com.spritle.chatapp.dao.UsertodayinterestingRepository;
import com.spritle.chatapp.domain.entities.Userlikes;
import com.spritle.chatapp.domain.entities.Usertodayinteresting;
import com.spritle.chatapp.domain.pojos.SessionData;
import com.spritle.chatapp.service.UserTodayIntrestingService;

@RestController
public class UserlikesRestcontroller {

	
	@Autowired
	private UserlikesRepository userlikesRepository;
	
	@Autowired
	private UsertodayinterestingRepository usertodayinterestingRepository;
	
	@Autowired
	private WebController webController;
	
	@Value("${ACTIVE_STATUS}")
	private String ACTIVE_STATUS;
	
	@RequestMapping(value = "/save-userlikesbyid/", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE })
	@Transactional(rollbackFor = Exception.class)
	public List<Usertodayinteresting> savetodayintersting(@RequestParam("likesid") int intrestingid) {
		System.out.println(intrestingid  +"   intrestingid");
		SessionData session=webController.getSessionData();
		Userlikes userlikes=new Userlikes();
		userlikes.setActivestatus(ACTIVE_STATUS);
		userlikes.setCrdate(new Date());
		userlikes.setCrusername(session.getUsername());
		userlikes.setInterestingid(intrestingid);
		userlikesRepository.savelikes(userlikes);		
		return usertodayinterestingRepository.findByAlltodayinteresting(ACTIVE_STATUS,session.getUsername());
	}
}
