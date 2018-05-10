package com.spritle.chatapp.restcontroller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import com.spritle.chatapp.domain.entities.UserDetail;
import com.spritle.chatapp.service.UserdetailService;



@RestController
public class SignupuserRestcontroller {

	@Autowired
	private UserdetailService userdetailService;
	
	@RequestMapping(value = "/signup-userdetails/", method = {RequestMethod.GET, RequestMethod.POST}, consumes = MediaType.APPLICATION_JSON_VALUE)
	public void saveAccidentChatSubmission(@RequestBody final UserDetail userDetail) {
		userdetailService.saveuserdetails(userDetail);
	}


	@RequestMapping(value = "/check-userduplicate/", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE })
	public Map<String, Boolean> validateUserCode(@RequestParam("username") String username) {		
		return userdetailService.usernameexists(username);
		
	}

	
	
}
