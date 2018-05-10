package com.spritle.chatapp.service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spritle.chatapp.dao.UserDetailRepository;
import com.spritle.chatapp.domain.entities.UserDetail;

@Service
public class UserdetailService {

	
	@Value("${ACTIVE_STATUS}")
	private String ACTIVE_STATUS;
	
	@Autowired
	UserDetailRepository userDetailRepository;
	
	
	
	@Transactional(rollbackFor = Exception.class)
	public void saveuserdetails(UserDetail userDetail) {
		userDetail.setActivestatus(ACTIVE_STATUS);
		userDetail.setPassword(new BCryptPasswordEncoder().encode(userDetail.getPassword()));
		userDetail.setCrdate(new Date());
		userDetailRepository.saveuserdetail(userDetail);
	}
	
	
	@Transactional(rollbackFor = Exception.class)
	public Map<String, Boolean> usernameexists(String username) {		
		List<UserDetail> userlist=userDetailRepository.findByUsername(username);
		if(userlist!=null && userlist.size()>0) {
			return Collections.singletonMap("userexistflag",true);
		}else {
			return Collections.singletonMap("userexistflag",false);
		}
	}
	
}
