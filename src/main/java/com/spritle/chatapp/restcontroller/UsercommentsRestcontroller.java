package com.spritle.chatapp.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spritle.chatapp.controller.WebController;
import com.spritle.chatapp.dao.UsercommentsRepository;
import com.spritle.chatapp.dao.UsertodayinterestingRepository;
import com.spritle.chatapp.domain.entities.Usercomments;
import com.spritle.chatapp.domain.entities.Usertodayinteresting;
import com.spritle.chatapp.domain.pojos.SessionData;
import com.spritle.chatapp.service.UserCommentsSevice;
import com.spritle.chatapp.service.UserTodayIntrestingService;

@RestController
public class UsercommentsRestcontroller {

	@Autowired
	private UsercommentsRepository usercommentsRepository;
	
	@Autowired
	UserCommentsSevice userCommentsSevice;
	
	@Autowired
	private WebController webController;
	
	@Autowired
	private UsertodayinterestingRepository usertodayinterestingRepository;
	
	@Value("${ACTIVE_STATUS}")
	private String ACTIVE_STATUS;
	
	@RequestMapping(value = "/get-todaycommentsbyid/", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE })
	@Transactional(rollbackFor = Exception.class)
	public List<Usercomments> getcommentsbyid(@RequestParam("intrestingid") int interestingid) {
		System.out.println(interestingid  +"   interestingid");
		
		return usercommentsRepository.findByinterestingid(interestingid,ACTIVE_STATUS);
		
	}
	
	@RequestMapping(value = "/save-usercommentsbyid/", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE })
	@Transactional(rollbackFor = Exception.class)
	public Map savecommentsbyid(@RequestParam("comments") String comments,@RequestParam("intrestingid") int interestingid) {
		System.out.println(comments  +"   comments");
		Map responsedata=new HashMap<>();
		SessionData session=webController.getSessionData();
		userCommentsSevice.savecomments(comments,interestingid);
		List<Usertodayinteresting> usertodayinteresting =usertodayinterestingRepository.findByAlltodayinteresting(ACTIVE_STATUS,session.getUsername());
		List<Usercomments> usercomments=usercommentsRepository.findByinterestingid(interestingid,ACTIVE_STATUS);
		responsedata.put("usercomments", usercomments);
		responsedata.put("todayintrestingdata", usertodayinteresting);
		
		return responsedata;
		
	}
	
	
}
