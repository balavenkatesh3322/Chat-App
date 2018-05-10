package com.spritle.chatapp.restcontroller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.spritle.chatapp.controller.WebController;
import com.spritle.chatapp.dao.UsertodayinterestingRepository;
import com.spritle.chatapp.domain.entities.Usertodayinteresting;
import com.spritle.chatapp.domain.pojos.SessionData;
import com.spritle.chatapp.service.UserTodayIntrestingService;

@RestController
public class UsertodayinterestingRestcontroller {

	
	@Autowired
	private UsertodayinterestingRepository usertodayinterestingRepository;
	
	@Autowired
	private UserTodayIntrestingService userTodayIntrestingService;
	
	@Autowired
	private WebController webController;
	
	@Value("${ACTIVE_STATUS}")
	private String ACTIVE_STATUS;
	
	@RequestMapping(value = "/getall-todayinterestings/", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE })
	@Transactional(rollbackFor = Exception.class)
	public List<Usertodayinteresting> getalltodayintersting() {
		SessionData session=webController.getSessionData();
		
		return usertodayinterestingRepository.findByAlltodayinteresting(ACTIVE_STATUS,session.getUsername());
		
		
	}
	
	@RequestMapping(value = "/save-todayinterestings/", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE })
	@Transactional(rollbackFor = Exception.class)
	public List<Usertodayinteresting> savetodayintersting(@RequestParam("intrestingdata") String intrestingdata) {
		System.out.println(intrestingdata  +"   intrestingdata");
		SessionData session=webController.getSessionData();
		userTodayIntrestingService.savetodayintersting(intrestingdata);
		return usertodayinterestingRepository.findByAlltodayinteresting(ACTIVE_STATUS,session.getUsername());
		
	}
	
}
